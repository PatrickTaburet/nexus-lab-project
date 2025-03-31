<?php

namespace App\Entity;

use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\File;
use Vich\UploaderBundle\Mapping\{
    Annotation as Vich,
    Annotation\UploadableField
};
use App\Repository\Scene2Repository;

#[ORM\Entity(repositoryClass: Scene2Repository::class)]
#[Vich\Uploadable]
class Scene2 extends BaseScene
{

    #[ORM\Column(type: "integer")]
    private $hue;

    #[ORM\Column(type: "integer")]
    private $colorRange;

    #[ORM\Column(type: "integer")]
    private $brightness;

    #[ORM\Column(type: "float")]
    private $movement;

    #[ORM\Column(type: "float")]
    private $deformA;

    #[ORM\Column(type: "float")]
    private $deformB;

    #[ORM\Column(type: "float")]
    private $shape;

    #[ORM\Column(type: "float")]
    private $rings;

    #[ORM\Column(type: "float")]
    private $diameter;

    #[ORM\Column(type: "float")]
    private $zoom;

    // --------- Communs settings -----------------
    
    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: "Scene2")]
    #[ORM\JoinColumn(nullable: false)]
    protected $user;

    #[ORM\ManyToMany(targetEntity: User::class)]
    #[ORM\JoinColumn(name: "scene2_id", referencedColumnName: "id", onDelete: "CASCADE")]
    #[ORM\InverseJoinColumn(name: "user_id", referencedColumnName: "id", onDelete: "CASCADE")]
    #[ORM\JoinTable(name: "user_G2artwork_like")]
    protected $likes;

    // --------- VICH UPLOADER-----------------

    #[ORM\Column(type: "datetime_immutable", nullable: true)]
    protected ?DateTimeImmutable $updatedAt = null;

    #[UploadableField(mapping: "scene2Images", fileNameProperty: "imageName")]
    protected ?File $imageFile = null;

//-------------------------------------------------------------------------------------------

    public function getHue(): ?int
    {
        return $this->hue;
    }

    public function setHue(int $hue): self
    {
        $this->hue = $hue;

        return $this;
    }

    public function getColorRange(): ?int
    {
        return $this->colorRange;
    }

    public function setColorRange(int $colorRange): self
    {
        $this->colorRange = $colorRange;

        return $this;
    }

    public function getBrightness(): ?int
    {
        return $this->brightness;
    }

    public function setBrightness(int $brightness): self
    {
        $this->brightness = $brightness;

        return $this;
    }

    public function getMovement(): ?float
    {
        return $this->movement;
    }

    public function setMovement(float $movement): self
    {
        $this->movement = $movement;

        return $this;
    }

    public function getDeformA(): ?float
    {
        return $this->deformA;
    }

    public function setDeformA(float $deformA): self
    {
        $this->deformA = $deformA;

        return $this;
    }

    public function getDeformB(): ?float
    {
        return $this->deformB;
    }

    public function setDeformB(float $deformB): self
    {
        $this->deformB = $deformB;

        return $this;
    }

    public function getShape(): ?float
    {
        return $this->shape;
    }

    public function setShape(float $shape): self
    {
        $this->shape = $shape;

        return $this;
    }

    public function getRings(): ?float
    {
        return $this->rings;
    }

    public function setRings(float $rings): self
    {
        $this->rings = $rings;

        return $this;
    }

    public function getDiameter(): ?float
    {
        return $this->diameter;
    }

    public function setDiameter(float $diameter): self
    {
        $this->diameter = $diameter;

        return $this;
    }

    public function getZoom(): ?float
    {
        return $this->zoom;
    }

    public function setZoom(float $zoom): self
    {
        $this->zoom = $zoom;

        return $this;
    }
}

