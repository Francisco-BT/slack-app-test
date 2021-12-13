const { App } = require("@slack/bolt");
const {
  SLACK_BOT_TOKEN,
  SLACK_SIGNING_SECRET,
  SLACK_APP_TOKEN,
} = require("./config");

const app = new App({
  token: SLACK_BOT_TOKEN,
  signingSecret: SLACK_SIGNING_SECRET,
  appToken: SLACK_APP_TOKEN,
});

// Listens to incoming messages that contain "hello"
app.message("hello", async (event) => {
  console.log("EVENT: ", JSON.stringify(event.message, null, 2));
  const { message, say } = event;
  // say() sends a message to the channel where the event was triggered
  await say({
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Hey there <@${message.user}>!`,
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "Click Me",
          },
          action_id: "button_click",
        },
      },
    ],
    text: `Hey there <@${message.user}>!`,
  });
});

app.event("team_join", async (event) => {
  console.log("Event: ", event.event);
  console.log("Body: ", event.body);
  console.log("Event say: ", event.say);
});

app.event("member_joined_channel", async (event) => {
  //console.log("Event data", JSON.stringify(event, null, 2));
  //await event.say(
  //  `Welcome <@${event.payload.user}> to this channel <@${event.payload.channel}>!`
  //);

  await app.client.chat.postMessage({
    channel: event.payload.user,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Welcome <@${event.payload.user}> to Arkus!`,
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "Go to Cultura Remota",
          },
          style: "primary",
          url: "http://187.191.25.39:1045/",
          action_id: "button_click",
        },
      },
    ],
    text: `Welcome <@${event.payload.user}> to Arkus!`,
  });
});

app.action("button_click", async (event) => {
  const { body, ack, say } = event;
  await ack();
  //await say(`<@${body.user.id}> clicked the button`);
});

(async () => {
  // Start your app
  await app.start(3000);

  console.log("⚡️ Bolt app is running!");
})();
