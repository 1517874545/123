// n8n API服务
class N8NService {
  constructor() {
    this.baseURL = 'https://zjf123.app.n8n.cloud/webhook/chatbot'
    this.timeout = 30000 // 增加到30秒超时，适应AI处理时间
  }

  /**
   * 发送消息到n8n聊天机器人
   * @param {string} message - 用户消息
   * @param {Object} context - 对话上下文
   * @returns {Promise<string>} - AI回复
   */
  async sendMessage(message, context = {}) {
    try {
      const payload = {
        message: message,
        context: context,
        timestamp: new Date().toISOString(),
        source: 'poem-app'
      }

      const response = await this._makeRequest(payload)
      
      if (response && response.reply) {
        return response.reply
      } else if (typeof response === 'string') {
        // 如果响应是字符串，尝试解析JSON
        try {
          const parsedResponse = JSON.parse(response)
          if (parsedResponse.reply) {
            return parsedResponse.reply
          }
        } catch (parseError) {
          console.warn('响应解析失败，返回原始字符串:', parseError)
          return response
        }
      } else {
        throw new Error('无效的响应格式')
      }
    } catch (error) {
      console.error('n8n服务调用失败:', error)
      // 提供更友好的错误信息
      if (error.message.includes('超时')) {
        throw new Error('AI服务响应较慢，请稍等片刻或重试')
      } else if (error.message.includes('网络')) {
        throw new Error('网络连接问题，请检查网络后重试')
      } else {
        throw new Error(`AI服务暂时不可用: ${error.message}`)
      }
    }
  }

  /**
   * 发起HTTP请求到n8n
   * @param {Object} payload - 请求数据
   * @returns {Promise<Object>} - 响应数据
   */
  async _makeRequest(payload) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      clearTimeout(timeoutId)
      if (error.name === 'AbortError') {
        throw new Error('请求超时，请检查网络连接')
      }
      throw error
    }
  }

  /**
   * 测试n8n服务连接
   * @returns {Promise<boolean>} - 连接状态
   */
  async testConnection() {
    try {
      const testMessage = '测试连接'
      await this.sendMessage(testMessage)
      return true
    } catch (error) {
      console.warn('n8n服务连接测试失败:', error.message)
      return false
    }
  }
}

// 创建单例实例
const n8nService = new N8NService()

export default n8nService