FROM golang:1.25 AS builder

RUN mkdir -p /build

WORKDIR /build

COPY go.mod go.sum ./

RUN go mod download

COPY . .

ENV GOOS=linux GOARCH=amd64 CGO_ENABLED=0

RUN go build -o ./lima-backend ./cmd/lima-backend/main.go

FROM golang:1.25-alpine AS final 

RUN mkdir -p /opt/lima-backend

RUN mkdir -p /etc/lima-backend

WORKDIR /opt/lima-backend

COPY --from=builder /build/lima-backend /opt/lima-backend

COPY ./config/config.yaml /etc/lima-backend/

EXPOSE 51515

ENTRYPOINT [ "/opt/lima-backend/lima-backend", "-c", "/etc/lima-backend/config.yaml"]