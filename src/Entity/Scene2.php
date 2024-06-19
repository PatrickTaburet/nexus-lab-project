<?php

namespace App\Entity;

use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\Scene2Repository;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\HttpFoundation\File\File;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

/**
 * @ORM\Entity(repositoryClass=Scene2Repository::class)
 * @Vich\Uploadable
 */
class Scene2
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     */
    private $hue;

    /**
     * @ORM\Column(type="integer")
     */
    private $colorRange;

    /**
     * @ORM\Column(type="integer")
     */
    private $brightness;

    /**
     * @ORM\Column(type="float")
     */
    private $movement;

    /**
     * @ORM\Column(type="float")
     */
    private $deformA;

    /**
     * @ORM\Column(type="float")
     */
    private $deformB;

    /**
     * @ORM\Column(type="float")
     */
    private $shape;

    /**
     * @ORM\Column(type="float")
     */
    private $rings;

    /**
     * @ORM\Column(type="float")
     */
    private $diameter;

    /**
     * @ORM\Column(type="float")
     */
    private $zoom;

    /**
     * @ORM\Column(type="string", length=100, nullable=true)
     */
    private $title;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $comment;

    // --------- VICH UPLOADER-----------------

    /**
     * @Vich\UploadableField(mapping="scene2Images", fileNameProperty="imageName")
     * @var File|null
     */
    private $imageFile;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $imageName;

    /**
    * @ORM\Column(type="datetime_immutable", nullable=true)
    */
    private $updatedAt;

   

//-------------------------------------------------------------------------------------------






    public function getId(): ?int
    {
        return $this->id;
    }

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

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(?string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getComment(): ?string
    {
        return $this->comment;
    }

    public function setComment(?string $comment): self
    {
        $this->comment = $comment;

        return $this;
    }

    // ---------- Vich Uploader - Screen Artwork ---------- //


    /**
     * If manually uploading a file (i.e. not using Symfony Form) ensure an instance
     * of 'UploadedFile' is injected into this setter to trigger the update. If this
     * bundle's configuration parameter 'inject_on_load' is set to 'true' this setter
     * must be able to accept an instance of 'File' as the bundle will inject one here
     * during Doctrine hydration.
     *
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

    public function setImageName(?string $imageName): void
    {
        $this->imageName = $imageName;
    }

    public function getImageName(): ?string
    {
        return $this->imageName;
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
