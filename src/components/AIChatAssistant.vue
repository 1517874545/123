<template>
  <div class="ai-chat-assistant">
    <!-- 悬浮按钮 -->
    <button 
      class="chat-toggle-btn"
      :class="{ 'active': isOpen }"
      @click="toggleChat"
    >
      <span v-if="!isOpen" class="chat-icon">🤖</span>
      <span v-else class="close-icon">✕</span>
    </button>

    <!-- 聊天窗口 -->
    <div v-if="isOpen" class="chat-window">
      <div class="chat-header">
        <h3>AI 诗词助手</h3>
        <button class="minimize-btn" @click="toggleChat">−</button>
      </div>
      
      <div class="chat-messages" ref="messagesContainer">
        <div 
          v-for="(message, index) in messages" 
          :key="index"
          :class="['message', message.type]"
        >
          <div class="message-avatar">
            <span v-if="message.type === 'ai'">🤖</span>
            <span v-else>👤</span>
          </div>
          <div class="message-content">
            <p>{{ message.content }}</p>
            <span class="message-time">{{ message.time }}</span>
          </div>
        </div>
        
        <div v-if="isLoading" class="message ai typing">
          <div class="message-avatar">🤖</div>
          <div class="message-content">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="chat-input">
        <input
          v-model="userInput"
          type="text"
          placeholder="输入您的问题..."
          @keyup.enter="sendMessage"
          :disabled="isLoading"
        />
        <button 
          @click="sendMessage" 
          :disabled="!userInput.trim() || isLoading"
          class="send-btn"
        >
          📤
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, nextTick } from 'vue'
import n8nService from '../services/n8nService.js'

export default {
  name: 'AIChatAssistant',
  setup() {
    const isOpen = ref(false)
    const userInput = ref('')
    const isLoading = ref(false)
    const messages = ref([
      {
        type: 'ai',
        content: '您好！我是诗词AI助手，可以帮您解答关于诗词的问题，推荐相关作品，或者介绍诗人背景。请问有什么可以帮您的？',
        time: getCurrentTime()
      }
    ])
    const messagesContainer = ref(null)

    const toggleChat = () => {
      isOpen.value = !isOpen.value
    }

    const sendMessage = async () => {
      if (!userInput.value.trim() || isLoading.value) return

      // 添加用户消息
      const userMessage = {
        type: 'user',
        content: userInput.value,
        time: getCurrentTime()
      }
      messages.value.push(userMessage)
      
      const question = userInput.value
      userInput.value = ''
      isLoading.value = true
      
      // 滚动到底部
      await nextTick()
      scrollToBottom()

      try {
        // 调用n8n API获取AI回复
        const aiResponse = await n8nService.sendMessage(question, {
          conversationId: 'poem-chat-' + Date.now(),
          previousMessages: messages.value.slice(-5).map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content
          }))
        })
        
        messages.value.push({
          type: 'ai',
          content: aiResponse,
          time: getCurrentTime()
        })
      } catch (error) {
        console.error('AI回复失败:', error)
        // 如果n8n服务不可用，使用备用回复
        const fallbackResponse = await getFallbackResponse(question)
        messages.value.push({
          type: 'ai',
          content: fallbackResponse,
          time: getCurrentTime()
        })
      } finally {
        isLoading.value = false
        await nextTick()
        scrollToBottom()
      }
    }

    const simulateAIResponse = (question) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          let response = ''
          
          // 简单的关键词匹配回复
          if (question.includes('推荐') || question.includes('推荐诗词')) {
            response = '我为您推荐几首经典诗词：\n1. 《静夜思》- 李白\n2. 《春晓》- 孟浩然\n3. 《登鹳雀楼》- 王之涣\n这些作品语言优美，意境深远，值得细细品味。'
          } else if (question.includes('李白') || question.includes('诗仙')) {
            response = '李白（701年－762年），字太白，号青莲居士，唐代伟大的浪漫主义诗人，被后人誉为"诗仙"。他的诗作豪放飘逸，想象丰富，如《将进酒》、《蜀道难》等都是千古名篇。'
          } else if (question.includes('杜甫') || question.includes('诗圣')) {
            response = '杜甫（712年－770年），字子美，自号少陵野老，唐代伟大的现实主义诗人，被尊为"诗圣"。他的诗作沉郁顿挫，反映社会现实，如《春望》、《茅屋为秋风所破歌》等。'
          } else if (question.includes('唐诗') || question.includes('宋词')) {
            response = '唐诗和宋词是中国古典文学的两大瑰宝。唐诗以格律严谨、意境深远著称；宋词则更注重音乐性和抒情性，形式更加灵活多样。两者都体现了中华文化的深厚底蕴。'
          } else if (question.includes('帮助') || question.includes('功能')) {
            response = '我可以帮您：\n• 推荐经典诗词作品\n• 介绍诗人背景和创作风格\n• 解释诗词的意境和内涵\n• 按朝代、主题分类查找诗词\n• 解答诗词相关的疑问'
          } else {
            response = `关于"${question}"的问题，我理解您想了解诗词相关的知识。目前我的知识库主要涵盖经典诗词作品、著名诗人介绍和诗词鉴赏等方面。您可以具体说明您想了解的内容吗？`
          }
          
          messages.value.push({
            type: 'ai',
            content: response,
            time: getCurrentTime()
          })
          resolve()
        }, 1000 + Math.random() * 1000) // 模拟网络延迟
      })
    }

    // 备用回复逻辑（当n8n服务不可用时使用）
    const getFallbackResponse = async (question) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          let response = ''
          
          if (question.includes('推荐') || question.includes('推荐诗词')) {
            response = '我为您推荐几首经典诗词：\
1. 《静夜思》- 李白\
2. 《春晓》- 孟浩然\
3. 《登鹳雀楼》- 王之涣\
这些作品语言优美，意境深远，值得细细品味。'
          } else if (question.includes('李白') || question.includes('诗仙')) {
            response = '李白（701年－762年），字太白，号青莲居士，唐代伟大的浪漫主义诗人，被后人誉为"诗仙"。他的诗作豪放飘逸，想象丰富，如《将进酒》、《蜀道难》等都是千古名篇。'
          } else if (question.includes('杜甫') || question.includes('诗圣')) {
            response = '杜甫（712年－770年），字子美，自号少陵野老，唐代伟大的现实主义诗人，被尊为"诗圣"。他的诗作沉郁顿挫，反映社会现实，如《春望》、《茅屋为秋风所破歌》等。'
          } else if (question.includes('唐诗') || question.includes('宋词')) {
            response = '唐诗和宋词是中国古典文学的两大瑰宝。唐诗以格律严谨、意境深远著称；宋词则更注重音乐性和抒情性，形式更加灵活多样。两者都体现了中华文化的深厚底蕴。'
          } else if (question.includes('帮助') || question.includes('功能')) {
            response = '我可以帮您：\
• 推荐经典诗词作品\
• 介绍诗人背景和创作风格\
• 解释诗词的意境和内涵\
• 按朝代、主题分类查找诗词\
• 解答诗词相关的疑问'
          } else {
            response = `关于"${question}"的问题，我理解您想了解诗词相关的知识。目前我的知识库主要涵盖经典诗词作品、著名诗人介绍和诗词鉴赏等方面。您可以具体说明您想了解的内容吗？`
          }
          
          resolve(response)
        }, 800) // 较短的延迟
      })
    }

    const scrollToBottom = () => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    }

    function getCurrentTime() {
      return new Date().toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }

    return {
      isOpen,
      userInput,
      isLoading,
      messages,
      messagesContainer,
      toggleChat,
      sendMessage
    }
  }
}
</script>

<style scoped>
.ai-chat-assistant {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
}

.chat-toggle-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2c5aa0 0%, #c62f2f 100%);
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(44, 90, 160, 0.3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-toggle-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 12px 35px rgba(44, 90, 160, 0.4);
}

.chat-toggle-btn.active {
  background: linear-gradient(135deg, #c62f2f 0%, #2c5aa0 100%);
}

.chat-window {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.chat-header {
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #2c5aa0 0%, #c62f2f 100%);
  color: white;
  border-radius: 16px 16px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.minimize-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.minimize-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.chat-messages {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  background: #f8f9fa;
}

.message {
  display: flex;
  margin-bottom: 1rem;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2c5aa0 0%, #c62f2f 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  margin: 0 0.75rem;
  flex-shrink: 0;
}

.message-content {
  max-width: 70%;
  background: white;
  padding: 0.75rem 1rem;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.message.user .message-content {
  background: linear-gradient(135deg, #2c5aa0 0%, #c62f2f 100%);
  color: white;
}

.message-content p {
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
  white-space: pre-line;
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.7;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #666;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.chat-input {
  padding: 1rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  gap: 0.75rem;
  background: white;
  border-radius: 0 0 16px 16px;
}

.chat-input input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 25px;
  outline: none;
  font-size: 0.9rem;
  transition: border-color 0.2s;
}

.chat-input input:focus {
  border-color: #2c5aa0;
}

.send-btn {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2c5aa0 0%, #c62f2f 100%);
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.05);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .ai-chat-assistant {
    bottom: 20px;
    right: 20px;
  }
  
  .chat-window {
    width: calc(100vw - 40px);
    height: 70vh;
    right: -10px;
  }
  
  .chat-toggle-btn {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
}

/* 滚动条样式 */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>