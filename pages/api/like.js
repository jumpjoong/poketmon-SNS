import prisma from "@/prisma/prisma";

async function handler(req, res) {
  const { method, body, query } = req;

  const dataGet = async () => {
    try {
      const id = Number(query.id);
      let listcheck = await prisma.favorite_table.findUnique({
        where: { id },
      });

      if (!listcheck) {
        listcheck = await prisma.favorite_table.create({
          data: { id, favorite_list: "" },
        });
      }

      res.json(listcheck);
    } catch (err) {
      res.status(500).json({ error: "Failed to get data", details: err.message });
    }
  };

  const dataPut = async () => {
    try {
      const id = Number(body.id);
      const { data, type } = body;

      // 좋아요 리스트 업데이트
      const favoritelistupdate = await prisma.favorite_table.update({
        where: { id },
        data: { favorite_list: data.toString() },
      });

      // 좋아요 카운트 가져오기 및 업데이트
      const favoritecount = await prisma.list_table.findUnique({
        where: { id },
        select: { like_count: true },
      });

      if (!favoritecount) {
        res.status(404).json({ error: "List not found" });
        return;
      }

      const newLikeCount = type === "up" ? favoritecount.like_count + 1 : favoritecount.like_count - 1;

      const updatedLikeCount = await prisma.list_table.update({
        where: { id },
        data: { like_count: newLikeCount },
        select: { like_count: true },
      });

      res.json({ favoritelistupdate, like_count: updatedLikeCount.like_count });
    } catch (err) {
      res.status(500).json({ error: "Failed to update data", details: err.message });
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
      return
  }
}

export default handler;