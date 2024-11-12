import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { RedisService } from "../../../lib/RedisService";

export async function GET(request: Request, context: any) {
  const { params } = context;
  const id = Number(params.id);

  const imageKey = RedisService.generateKey("image", String(id));
  // try {
  //   if (await RedisService.hasKey(imageKey)) {
  //     return NextResponse.json(await RedisService.getKey(imageKey));
  //   }
  // } catch (e) {
  //   if (e instanceof Error) {
  //     console.error(
  //       "[Redis] Could not connect to Redis due to error " + e.message
  //     );
  //   } else {
  //     console.error(
  //       "[Redis] Could not connect to Redis due to an unknown error"
  //     );
  //   }
  // }

  const result = await prisma.image.findFirst({
    where: {
      id,
    },
  });

  // try {
  //   await RedisService.setKey(imageKey, JSON.stringify(result));
  // } catch (e) {
  //   if (e instanceof Error) {
  //     console.error(
  //       "[Redis] Could not connect to Redis due to error " + e.message
  //     );
  //   } else {
  //     console.error(
  //       "[Redis] Could not connect to Redis due to an unknown error"
  //     );
  //   }
  // }

  return NextResponse.json(result);
}
