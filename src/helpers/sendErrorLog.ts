import { env } from "./env";

export const sendErrorLog = async (
  projectName: string,
  payload: Record<string, string>
) => {
  return fetch("https://project-alert-flame.vercel.app/api/send-message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": env.TG_BOT_KEY,
    },
    body: JSON.stringify({
      type: "error",
      project_name: projectName,
      payload,
    }),
  });
};
