<?php
// src/Command/ImportProductosCommand.php

namespace App\Command;

use App\Entity\Producto;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'import:productos',
    description: 'Importa productos desde un archivo JSON'
)]
class ImportProductosCommand extends Command
{
    private EntityManagerInterface $em;

    public function __construct(EntityManagerInterface $em)
    {
        parent::__construct();
        $this->em = $em;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $archivo = __DIR__ . '/../../public/data/productos.json'; // ajusta la ruta si es necesario

        if (!file_exists($archivo)) {
            $io->error("No se encontró el archivo productos.json");
            return Command::FAILURE;
        }

        $datos = json_decode(file_get_contents($archivo), true);

        foreach ($datos as $dato) {
            $producto = new Producto();
            $producto->setNombre($dato['nombre']);
            $producto->setPrecio((float)$dato['precio']);
            $producto->setStock($dato['stock']);
            $producto->setDescripcion($dato['descripcion']);
            $producto->setImatgeurl($dato['imatgeurl']);
            $producto->setCategoria($dato['categoria']);

            $this->em->persist($producto);
        }

        $this->em->flush();

        $io->success('✅ Productos importados correctamente.');

        return Command::SUCCESS;
    }
}


?>
