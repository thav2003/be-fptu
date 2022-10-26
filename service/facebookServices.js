const axios = require("axios");
const fs = require("fs");
const PAGE_TOKEN_DEV =
  "EAAZArPDoZBsisBAPqZCZBtinzg3AMt1wK3AjgSo2ZCfztw8ojwZAMobBPZBkm6oXXSSgULqyGY4UZBLpTLoPXhQvqltwdutxEmGoF0Gy1Y5tmjJIbTTrOvtE3Pvm237opH8ZB21QGszNb71D9rqfyG5BQhYfEq9xmmfYvZCg5EgDnExzRk6uh6G5HP1Y858OdlTxoZD";
const PAGE_TOKEN_HL =
  "EAALNMLKi8bUBALXvqVuQas3coEJYd3z4u7mtFrwRqrSpSIzlOuMcRZBH0bb8WvzZBDPOHMdVuTUXHCZBwMjDzzPc7stIonZBAZCXRewZCOm4U4fdLxPeNamX1R2ZBWCfo3AcBwjygUIXNGIithmoow5taYsfzS0ZC8WyylN2zBuQqV2rMyDsuesXqZCZC3vUIZA4mtk7gcYXiRVHAZDZD";

const PAGE_ID_DEV = "113297884460095";
const PAGE_ID_HL = "113016957969174";
const GROUP_ID_HL = "1791189171067458";
const PAGE_TOKEN = PAGE_TOKEN_DEV;
const PAGE_ID = PAGE_ID_DEV;
const APP_ID = "1806756279661099";
const BASE_URL = "https://graph.facebook.com/v15.0/";
module.exports.GraphServices = {
  getPost,
  getReaction,
  getTag,
  getData,
  getView,
  getShares,
  createPost,
  deletePost,
};
let i = 0;
async function getPost() {
  const response = await axios.get(
    BASE_URL + `me?fields=feed&access_token=` + PAGE_TOKEN
  );
  const node = response.data;

  return node.feed;
}

async function getReaction(Objid) {
  const response = await axios.get(
    BASE_URL +
      Objid +
      `/insights/post_reactions_by_type_total?access_token=` +
      PAGE_TOKEN
  );
  const node = response.data;
  console.log("reaction");
  return node.data;
}
async function getShares(Objid) {
  const response = await axios.get(
    BASE_URL + Objid + `?fields=shares&access_token=` + PAGE_TOKEN
  );
  const node = response.data;
  console.log("shares");
  return node;
}
async function getTag(Objid) {
  const response = await axios.get(
    BASE_URL + Objid + `?fields=message_tags&access_token=` + PAGE_TOKEN
  );
  const node = response.data;
  console.log("tags");
  return node.message_tags;
}
async function getComment(Objid) {
  const response = await axios.get(
    BASE_URL + Objid + `/comments?filter=stream&access_token=` + PAGE_TOKEN
  );
  const node = response.data;
  console.log("comments");
  return node;
}
async function getView(Objid) {
  const response = await axios.get(
    BASE_URL + Objid + `/insights/post_impressions?access_token=` + PAGE_TOKEN
  );
  const node = response.data;
  console.log("views");
  return node.data;
}

async function getData() {
  const data = [];
  const feeds = await getPost();

  for (const feed of feeds.data) {
    //console.log(feed.message);
    console.log(i++);
    //const tagPromise = getTag(feed.id);
    const commentPromise = getComment(feed.id);
    const reactionPromsie = getReaction(feed.id);
    const viewPromise = getView(feed.id);
    const sharePromise = getShares(feed.id);
    const [comments, reactions, views, shares] = await Promise.all([
      commentPromise,
      reactionPromsie,
      viewPromise,
      sharePromise,
    ]);
    // console.log(tags[0]);
    //console.log(reactions[0].values[0]);
    //console.log(comments.data);
    //console.log(views[0].values[0].value);
    //console.log( posts[0].reactions)
    //let title = "";
    let reaction_total = 0;
    const shares_count = shares.shares ? shares.shares.count : 0;
    for (const type in reactions[0].values[0].value) {
      if (reactions[0].values[0].value[type] !== undefined) {
        reaction_total += reactions[0].values[0].value[type];
      }
    }

    // tags
    //   ? tags.forEach(tag => {
    //       //console.log(tag);
    //       title += tag.name + " ";
    //     })
    //   : (title = "Không có tag");
    //console.log(title);

    data.push({
      id: feed.id,
      //tags: tags,
      reactions: reactions[0].values[0].value,
      reaction_total: reaction_total,
      comments: comments.data,
      view: views[0].values[0].value,
      share: shares_count,
      //title: title,
    });
  }

  return data;
}
//post without image
async function createPost(data) {
  const response = await axios.post(
    BASE_URL + PAGE_ID + `/feed?access_token=` + PAGE_TOKEN,
    {
      message: data.message,
      link: data.link || null,
    }
  );
  const node = response.data;
  return node;
}
async function deletePost(postId) {
  const response = await axios.delete(
    BASE_URL + postId + `?access_token=` + PAGE_TOKEN
  );
  const node = response.data;
  return node;
}
// async function uploadImage(ext) {
//   try {
//     const res = await axios.post(
//       BASE_URL + APP_ID + `/upload?access_token=` + PAGE_TOKEN,
//       {
//         file_length: null,
//         file_type: `image/${ext}`,
//       }
//     );
//     if (!res || res.error) {
//       console.log(!res ? "error occurred" : res.error);
//       return;
//     }
//     const config = {
//       headers: {
//         Authorization: `OAuth ${PAGE_TOKEN}`,
//         file_offset: 0,
//       },
//     };
//     const response = await axios.post(
//       BASE_URL + res.id,
//       {
//         formData: {
//           source: {
//             value: fs.createReadStream(imagePath),
//             options: {
//               filename: filename,
//               contentType: "image/jpeg",
//             },
//           },
//         },
//       },
//       config
//     );
//     return response;
//   } catch (error) {
//     console.log("Error: ", error);
//   }
// }
