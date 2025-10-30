import { NestFactory, PartialGraphHost } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { ConfigService } from "./config/config.service";
import { writeFileSync } from "fs";

async function bootstrap() {
  // 创建HTTP应用程序
  const app = await NestFactory.create(AppModule, {
    // snapshot: true,
    // abortOnError: false,
    // logger: false, // 禁用所有NestJS日志
  });

  // 获取配置服务
  const configService = app.get(ConfigService);

  // 启用全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );

  // 启用 CORS
  app.enableCors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  });

  // 连接到NATS微服务
  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      //url: configService.get<string>("NATS_URL", "nats://localhost:4222"),
      url: configService.nats.url,
      queue: configService.nats.queue,
    },
  });

  // 启动微服务
  await app.startAllMicroservices();

  // 启动 HTTP 服务器
  await app.listen(configService.app.port);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Environment: ${configService.app.environment}`);
  console.log(`GraphQL playground: http://localhost:${configService.app.port}${configService.graphql.path}`);
  console.log(`Microservice is connected to NATS at: ${configService.nats.url}`);
}

bootstrap();
// bootstrap().catch((err) => {
//   writeFileSync("graph.json", PartialGraphHost.toString() ?? "");
//   process.exit(1);
// });
