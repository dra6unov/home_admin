# Этап 1: Сборка приложения
FROM golang:1.26-alpine AS builder

WORKDIR /app

# Копируем go.mod и go.sum, загружаем зависимости
COPY go.mod go.sum ./
RUN go mod download

# Копируем весь исходный код и собираем бинарник
COPY . .
# CGO_ENABLED=0 делает бинарник статически связанным (нужно для alpine)
RUN CGO_ENABLED=0 GOOS=linux go build -o /home_admin_backend ./cmd/app

# Этап 2: Финальный минимальный образ
FROM alpine:3.21

COPY --from=builder --chmod=555 --chown=nobody:nobody /home_admin_backend /usr/local/bin/home_admin_backend

USER nobody

ENTRYPOINT ["home_admin_backend"]
