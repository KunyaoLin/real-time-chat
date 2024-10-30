// 1. 设计目标
// 确保用户即使在下线时也能接收来自他人的消息，并在用户重新上线时将未读消息推送给他们，类似于留言系统或未读消息提醒的实现。系统使用 MongoDB 存储消息、Socket.IO 实现实时通信。

// 2. 功能模块和步骤
// 2.1 消息存储设计
// 目标：在消息模型中为每条消息存储发送方和接收方信息、内容和阅读状态。

// 字段说明：
// senderId：发送方用户的唯一标识。
// receiverId：接收方用户的唯一标识。
// content：消息内容。
// timestamp：消息发送时间。
// readStatus：是否已读的状态，默认值为 false，表示消息未读。
// 2.2 离线消息逻辑
// 目标：判断接收方的在线状态，如果用户下线，将消息标记为未读存储。

// 判断离线状态：
// 通过记录用户的 lastSeen 时间或标记 isOnline 状态，服务器在每次消息发送时可检查接收方的在线状态。
// 消息存储：
// 若接收方在线，立即通过 WebSocket 推送消息并将 readStatus 设置为 true。
// 若接收方离线，将消息存储并将 readStatus 保持为 false。
// 2.3 用户上线后获取未读消息
// 目标：在用户重新上线时获取其所有未读消息。

// API 路由：创建一个获取未读消息的路由，例如 GET /messages/unread，返回所有 readStatus: false 的消息。
// 使用流程：
// 用户上线时，客户端调用 GET /messages/unread，获取未读消息数据。
// 将未读消息通过 WebSocket 或其他实时推送方式显示在前端。
// 2.4 实时消息更新
// 目标：在用户上线后，通过 WebSocket 将未读消息推送到客户端，并更新消息的阅读状态。

// WebSocket 连接：在用户上线时，前端连接到服务器的 WebSocket。
// 推送未读消息：服务器检测到用户上线后，将所有未读消息通过 WebSocket 推送到前端。
// 标记已读：前端接收到消息后，调用 PUT /messages/:messageId/markAsRead API，将 readStatus 更新为 true。

const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A room must have a name"],
  },
  type: {
    type: String,
    enum: ["public", "private"], // 房间类型，表示公共或私人
    default: "public",
  },
  accessLevel: {
    type: String,
    enum: ["regular", "vip"], // 房间权限，区分普通和VIP
    default: "regular",
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // 房间创建者，引用 User 模型
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // 成员列表，引用 User 模型
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    maxlength: 200, // 房间描述，增加房间信息
  },
});

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;
