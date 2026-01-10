# বেস ইমেজ
FROM node:18-alpine

# অ্যাপ ডিরেক্টরি তৈরি
WORKDIR /usr/src/app

# প্যাকেজ ফাইল কপি
COPY package*.json ./

# ডিপেন্ডেন্সি ইনস্টল
RUN npm install --production

# সোর্স কোড কপি
COPY . .

# পোর্ট এক্সপোজ
EXPOSE 3000

# অ্যাপ স্টার্ট কমান্ড
CMD [ "node", "app.js" ]