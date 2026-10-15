import * as SDK from "azure-devops-extension-sdk";
import {
  WorkItemTrackingServiceIds
} from "azure-devops-extension-api/WorkItemTracking";

const MIRO_FIELD = "Custom.MiroURL";

async function updatePreview() {
  const workItemService = await SDK.getService(
    WorkItemTrackingServiceIds.WorkItemFormService
  );

  const value = await workItemService.getFieldValue(MIRO_FIELD);

  const iframe = document.getElementById("miro");
  const message = document.getElementById("message");

  if (!value) {
    iframe.style.display = "none";
    message.style.display = "block";
    message.innerText = "Nenhuma URL do Miro informada.";
    return;
  }

  let url = String(value).trim();

  url = url.replace(
    "miro.com/app/board/",
    "miro.com/app/live-embed/"
  );

  iframe.src = url;
  iframe.style.display = "block";
  message.style.display = "none";
}

SDK.init();

SDK.ready().then(() => {
  SDK.register(SDK.getContributionId(), () => ({
    onLoaded: async () => {
      await updatePreview();
    },

    onFieldChanged: async (args) => {
      if (
        args.changedFields &&
        args.changedFields[MIRO_FIELD] !== undefined
      ) {
        await updatePreview();
      }
    }
  }));

  updatePreview();
});