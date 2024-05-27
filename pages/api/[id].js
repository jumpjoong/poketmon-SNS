import prisma from "@/prisma/prisma";

export default function handler(req, res) {
  const { method, body, query } = req;

  const dataDelete = async () => {
    const listDelete = await prisma.list_table.delete({
      where: {
        id: Number(query.id),
      },
    });
    res.send("delete");
  };
  const dataPut = async () => {
    const listUpdate = await prisma.list_table.update({
      where: {
        id: Number(body.id),
      },
      data: {
        content: body.content,
      },
    });
    res.send("update");
  };
  switch (method) {
    case "DELETE":
      dataDelete();
      break;
    case "PUT":
      dataPut();
      break;
    default:
      return;
  }
}
