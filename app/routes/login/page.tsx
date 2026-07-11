import { data, redirect, useFetcher } from "react-router";
import { css } from "styled-system/css";
import { vstack } from "styled-system/patterns";
import { z } from "zod/v4";

import { irisClient } from "~/api/iris/client";
import { setCookie } from "~/features/auth/cookie.server";

import type { Route } from "./+types/page";

type ErrorField = {
  username?: string;
  password?: string;
};

const fieldSchema = z.strictObject({
  username: z
    .string("ユーザー名を入力してください。")
    .min(1, "ユーザー名を入力してください。")
    .max(255, "ユーザー名が長すぎます。"),
  password: z
    .string("パスワードを入力してください。")
    .min(1, "パスワードを入力してください。")
    .max(255, "パスワードが長すぎます。"),
});

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const username = formData.get("username");
  const password = formData.get("password");

  const parsed = fieldSchema.safeParse({ username, password });

  if (parsed.error) {
    const error = z.treeifyError(parsed.error);

    return data(
      {
        username: error.properties?.username?.errors.join("\n"),
        password: error.properties?.password?.errors.join("\n"),
      } satisfies ErrorField,
      { status: 400 },
    );
  }

  const loginResult = await irisClient.POST("/auth/login", {
    body: {
      username: parsed.data.username,
      password: parsed.data.password,
    },
  });

  if (loginResult.error) {
    if (loginResult.response.status == 401) {
      return data(
        {
          password: "ユーザー名かパスワードが異なります。",
        } satisfies ErrorField,
        { status: 401 },
      );
    }

    if (loginResult.response.status == 429) {
      return data(
        {
          password: "リクエスト上限です! しばらく待ってからお試しください。",
        } satisfies ErrorField,
        { status: 429 },
      );
    }

    return data(
      {
        password: "不明なエラーが発生しました。",
      } satisfies ErrorField,
      { status: 500 },
    );
  }

  const url = new URL(request.url);
  const host = request.headers.get("host") ?? url.host;
  const secure =
    (request.headers.get("x-forwarded-proto") ??
      url.protocol.replace(":", "")) === "https";

  const cookieHeader = setCookie(loginResult.data.response.session_key, {
    host,
    secure,
  });

  return redirect("/", {
    headers: {
      "Set-Cookie": cookieHeader,
    },
  });
}

export default function LoginPage() {
  const fetcher = useFetcher();
  const errors = fetcher.data as ErrorField | undefined;

  return (
    <main className={root}>
      <fetcher.Form className={form} method="post">
        <h1 className={title}>ログイン</h1>
        <label className={field}>
          <span className={fieldName}>ユーザー名</span>
          <input
            className={fieldInput}
            required
            type="text"
            autoComplete="username"
            name="username"
          />
          {errors?.username && (
            <span className={fieldError}>{errors.username}</span>
          )}
        </label>
        <label className={field}>
          <span className={fieldName}>パスワード</span>
          <input
            className={fieldInput}
            required
            type="password"
            autoComplete="current-password"
            name="password"
          />
          {errors?.password && (
            <span className={fieldError}>{errors.password}</span>
          )}
        </label>
        <button type="submit">ログイン</button>
      </fetcher.Form>
    </main>
  );
}

const root = css({
  display: "flex",
  minHeight: "100dvh",
  alignItems: "center",
  justifyContent: "center",
});

const form = vstack({
  alignItems: "stretch",
  fontFamily: "ja",
  padding: "2em 3em",
  border: "1px solid {colors.brand.light}",
  borderRadius: "8px",
  gap: "16px",
});

const title = css({
  marginBottom: "16px",
  textAlign: "center",
});

const field = vstack({
  alignItems: "stretch",
  width: "15em",
  gap: "2px",
});

const fieldName = css({
  opacity: "80%",
});

const fieldInput = css({
  fontFamily: "en",
  alignItems: "start",
  border: "1px solid color-mix(in oklab, {colors.brand.light} 50%, white 50%)",
  borderRadius: "4px",
  padding: "0.2em 0.7em",
});

const fieldError = css({
  fontSize: "0.75em",
  color: "plume.identity",
});
