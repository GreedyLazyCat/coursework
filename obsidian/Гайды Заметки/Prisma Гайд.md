### **Для пустого файла:**
Установка необходимых
зависимостей
```
npm i --save-dev prisma typescript tsx @types/node
```
Миграция изменений:
```
npx prisma migrate dev --name init
```
Генерация клиента:
```
npx prisma generate
```
Установка клиента
```
npm install @prisma/client
```
Короткий импорт клиента: 
```
import { PrismaClient } from "./generated/prisma";
const prisma = new PrismaClient()
```
### **Prisma и Nuxt**

Установка:
```
npm install @prisma/nuxt
```
Прописать в конфиг:
```
...
modules: ["@prisma/nuxt"]
...
```
Хук
```
usePrismaClient()
```
### **Синтаксис моделей**
Определение отношения
```
user   User    @relation(fields: [userId], references: [id])  
userId Int     
```
`fields` - какое поле в объекте
`references` - какое поле в объекте, на который ссылаются