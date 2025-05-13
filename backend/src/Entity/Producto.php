<?php

namespace App\Entity;

use App\Repository\ProductoRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ProductoRepository::class)]
class Producto
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['producto:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['producto:read'])]
    private ?string $nombre = null;

    #[ORM\Column]
    #[Groups(['producto:read'])]
    private ?float $precio = null;

    #[ORM\Column]
    #[Groups(['producto:read'])]
    private ?int $stock = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['producto:read'])]
    private ?string $descripcion = null;

    #[ORM\Column(length: 255)]
    #[Groups(['producto:read'])]
    private ?string $imatgeurl = null;

    #[ORM\Column(length: 255)]
    #[Groups(['producto:read'])]
    private ?string $categoria = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNombre(): ?string
    {
        return $this->nombre;
    }

    public function setNombre(string $nombre): static
    {
        $this->nombre = $nombre;

        return $this;
    }

    public function getPrecio(): ?float
    {
        return $this->precio;
    }

    public function setPrecio(float $precio): static
    {
        $this->precio = $precio;

        return $this;
    }

    public function getStock(): ?int
    {
        return $this->stock;
    }

    public function setStock(int $stock): static
    {
        $this->stock = $stock;

        return $this;
    }

    public function getDescripcion(): ?string
    {
        return $this->descripcion;
    }

    public function setDescripcion(string $descripcion): static
    {
        $this->descripcion = $descripcion;

        return $this;
    }

    public function getImatgeurl(): ?string
    {
        return $this->imatgeurl;
    }

    public function setImatgeurl(string $imatgeurl): static
    {
        $this->imatgeurl = $imatgeurl;

        return $this;
    }

    public function getCategoria(): ?string
    {
        return $this->categoria;
    }

    public function setCategoria(string $categoria): static
    {
        $this->categoria = $categoria;

        return $this;
    }
}
