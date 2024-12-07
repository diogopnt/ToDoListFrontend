# Usar uma imagem base de Node.js para compilar o projeto
FROM node:18 as build

# Diretório de trabalho dentro do container
WORKDIR /app

# Copiar package.json e instalar dependências
COPY package*.json ./
RUN npm install

# Copiar o resto dos arquivos e compilar
COPY . .
RUN npm run build --prod

# Usar uma imagem leve de Nginx para servir os arquivos
FROM nginx:alpine
COPY --from=build /app/dist/todo-list-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor a porta 80
EXPOSE 80

# Comando para iniciar o servidor
CMD ["nginx", "-g", "daemon off;"]
