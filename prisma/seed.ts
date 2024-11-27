const { PrismaClient } = require("@prisma/client");


const prisma = new PrismaClient();


const SERVICES = [
  {
    name: "Corte de Cabelo",
    description: "Estilo personalizado com as últimas tendências.",
    price: 60.0,
    imageUrl: "https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png",
  },
  {
    name: "Barba",
    description: "Modelagem completa para destacar sua masculinidade.",
    price: 40.0,
    imageUrl: "https://utfs.io/f/e6bdffb6-24a9-455b-aba3-903c2c2b5bde-1jo6tu.png",
  },
  {
    name: "Pézinho",
    description: "Acabamento perfeito para um visual renovado.",
    price: 35.0,
    imageUrl: "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
  },
  {
    name: "Sobrancelha",
    description: "Expressão acentuada com modelagem precisa.",
    price: 20.0,
    imageUrl: "https://utfs.io/f/2118f76e-89e4-43e6-87c9-8f157500c333-b0ps0b.png",
  },
  {
    name: "Massagem",
    description: "Relaxe com uma massagem revigorante.",
    price: 50.0,
    imageUrl: "https://utfs.io/f/c4919193-a675-4c47-9f21-ebd86d1c8e6a-4oen2a.png",
  },
  {
    name: "Hidratação",
    description: "Hidratação profunda para cabelo e barba.",
    price: 25.0,
    imageUrl: "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
  },
];




async function seedDatabase() {
  try {
    // Create base barbershop
    const barbershop = await prisma.barbershop.create({
      data: {
        name: "Barbearia Vintage",
        address: "Rua da Barbearia, 123",
        imageUrl: "https://utfs.io/f/c97a2dc9-cf62-468b-a851-bfd2bdde775f-16p.png",
        phones: ["(98) 99999-9999", "(99) 99999-9999"],
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac augue ullamcorper, pharetra orci mollis, auctor tellus.",
      },
    });

     
    // Create services
    const createdServices = [];
    for (const service of SERVICES) {
      const createdService = await prisma.barbershopService.create({
        data: {
          name: service.name,
          description: service.description,
          price: service.price,
          barbershopId: barbershop.id,
          imageUrl: service.imageUrl,
        },
      });
      createdServices.push(createdService);
    }


   


    console.log("Database seeded successfully!");
    await prisma.$disconnect();
  } catch (error) {
    console.error("Error seeding database:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

seedDatabase();