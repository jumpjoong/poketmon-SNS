import prisma from "@/prisma/prisma";

async function handler(req, res) {
  const { method, body, query } = req;

  const getData = async () => {
    const myList = await prisma.list_table.findMany({
      where: {
        user_id: Number(query.id),
      },
    });
    res.json(myList);
  };

  switch (method) {
    case "GET":
      getData();
      break;
    default:
      return;
  }
}

export default handler;
