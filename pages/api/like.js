import prisma from "@/prisma/prisma";

async function handler(req, res) {
  const { method, body, query } = req;
  const dataGet = async () => {
    try {
      const listcheck = await prisma.favorite_table.findUnique({
        where: {
          id: Number(query.id),
        },
      });

      if (listcheck === null) {
        const createlist = await prisma.favorite_table.create({
          data: {
            id: Number(query.id),
            favorite_list: "",
          },
        });
        res.json(createlist);
      } else {
        res.json(listcheck);
      }
    } catch (err) {
      res.send(err);
    }
  };

  const dataPut = async () => {
    try {
      // 좋아요 리스트에 고유 키 추가
      const favoritelistupdate = await prisma.favorite_table.update({
        where: {
          id: Number(body.id),
        },
        data: {
          favorite_list: body.data.toString(),
        },
      });
      //좋아요 숫자 카운트 가져오기
      const favoritecount = await prisma.list_table.findUnique({
        where: {
          id: Number(body.id),
        },
        select: {
          like_count: true,
        },
      });
      
      // 좋아요 카운트 숫자 담기
      let result;
      if (body.type === "up") {
        result = favoritecount.like_count + 1;
      } else if (body.type === "down") {
        result = favoritecount.like_count - 1;
      }
      //좋아요 카운트 계산된거 db에 업데이트
      await prisma.list_table.update({
        where: {
          id: body.id,
        },
        data: {
          like_count: result,
        },
      });
      //좋아요 숫자 가져오기
      const getLike = await  prisma.list_table.findUnique({
        where: {
          id: Number(body.id),
        },
        select: {
          like_count: true,
        },
      });
      const data = {favoritelistupdate, getLike}
      res.json(data);
    } catch (err) {
      res.send(err);
    }
  };

  switch (method) {
    case "GET":
      await dataGet();
      break;
    case "PUT":
      await dataPut();
      break;
    default:
      return;
  }
}

export default handler;
