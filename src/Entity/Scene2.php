<?php

namespace App\Entity;

use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\{
    HttpFoundation\File\File,
    Serializer\Annotation\Groups
};
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
    #[Groups("sceneDataRecup")]
    private $hue;

    #[ORM\Column(type: "integer")]
    #[Groups("sceneDataRecup")]
    private $colorRange;

    #[ORM\Column(type: "integer")]
    #[Groups("sceneDataRecup")]
    private $brightness;

    #[ORM\Column(type: "float")]
    #[Groups("sceneDataRecup")]
    private $movement;

    #[ORM\Column(type: "float")]
    #[Groups("sceneDataRecup")]
    private $deformA;

    #[ORM\Column(type: "float")]
    #[Groups("sceneDataRecup")]
    private $deformB;

    #[ORM\Column(type: "float")]
    #[Groups("sceneDataRecup")]
    private $shape;

    #[ORM\Column(type: "float")]
    #[Groups("sceneDataRecup")]
    private $rings;

    #[ORM\Column(type: "float")]
    #[Groups("sceneDataRecup")]
    private $diameter;

    #[ORM\Column(type: "float")]
    #[Groups("sceneDataRecup")]
    private $zoom;

    // --------- Communs settings -----------------
    
    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: "Scene2")]
    #[ORM\JoinColumn(nullable: false)]
    protected $user;

    #[ORM\ManyToMany(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[ORM\JoinTable(name: "user_G2artwork_like")]
    protected $likes;

    // --------- VICH UPLOADER-----------------

    #[ORM\Column(type: "datetime_immutable", nullable: true)]
    private $updatedAt;

    #[UploadableField(mapping: "scene2Images", fileNameProperty: "imageName")]
    private ?File $imageFile = null;

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

    // ---------- Vich Uploader - Screen Artwork ---------- //
    
    /**
     * @param File|\Symfony\Component\HttpFoundation\File\UploadedFile|null $imageFile
     */
    public function setImageFile(?File $imageFile = null): void
    {
        $this->imageFile = $imageFile;

        if (null !== $imageFile) {
            // It is required that at least one field changes if you are using doctrine
            // otherwise the event listeners won't b    e called and the file is lost
            $this->updatedAt = new \DateTimeImmutable();
        }
    }

    public function getImageFile(): ?File
    {
        return $this->imageFile;
    }

    public function getUpdatedAt(): ?DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?DateTimeImmutable $updatedAt): self
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }
}

