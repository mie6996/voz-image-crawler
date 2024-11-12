import { prisma } from "@/app/lib/prisma";
import { RedisService } from "@/app/lib/RedisService";
import { NextResponse } from "next/server";

export async function GET({ params }: { params: { id: number } }) {
  const id = params.id;

  const imageKey = RedisService.generateKey("image", String(id));
  try {
    if (await RedisService.hasKey(imageKey)) {
      return NextResponse.json(await RedisService.getKey(imageKey));
    }
  } catch (e) {
    if (e instanceof Error) {
      console.error(
        "[Redis] Could not connect to Redis due to error " + e.message
      );
    } else {
      console.error(
        "[Redis] Could not connect to Redis due to an unknown error"
      );
    }
  }

  const result = await prisma.image.findFirst({
    where: {
      id,
    },
  });

  try {
    await RedisService.setKey(imageKey, JSON.stringify(result));
  } catch (e) {
    if (e instanceof Error) {
      console.error(
        "[Redis] Could not connect to Redis due to error " + e.message
      );
    } else {
      console.error(
        "[Redis] Could not connect to Redis due to an unknown error"
      );
    }
  }

  return NextResponse.json(result);
}
