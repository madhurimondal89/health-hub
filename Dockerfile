# বেস ইমেজ
FROM node:18-alpine

# অ্যাপ ডিরেক্টরি
WORKDIR /app

# এনভায়রনমেন্ট ভেরিয়েবল
ENV PORT=3000
ENV NODE_ENV=production

# প্যাকেজ ফাইল কপি ও ইনস্টল
COPY package*.json ./
RUN npm install --production

# বাকি সব ফাইল কপি
COPY . .

# পোর্ট এক্সপোজ (খুব জরুরি)
EXPOSE 3000

# অ্যাপ স্টার্ট কমান্ড
CMD ["node", "app.js"]