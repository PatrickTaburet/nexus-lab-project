<?php

namespace App\Entity;


use DateTimeImmutable;
use Symfony\Component\{
    HttpFoundation\File\File,
    Serializer\Annotation\Groups
};
use Vich\UploaderBundle\Mapping\{
    Annotation as Vich,
    Annotation\UploadableField
};
use Doctrine\ORM\Mapping as ORM;
use App\Repository\SceneD2Repository;

#[ORM\Entity(repositoryClass: SceneD2Repository::class)]
#[Vich\Uploadable]
class SceneD2 extends BaseScene
{
    #[ORM\Column(type: "integer")]
    #[Groups("sceneDataRecup")]
    private $divFactor;

    #[ORM\Column(type: "integer")]
    #[Groups("sceneDataRecup")]
    private $copy;

    #[ORM\Column(type: "integer")]
    #[Groups("sceneDataRecup")]
    private $deformation;

    /**
     * @ORM\Column(type="float")
     * @Groups ("sceneDataRecup")
     */
    private $sizeFactor;

    #[ORM\Column(type: "integer")]
    #[Groups("sceneDataRecup")]
    private $angle;

    #[ORM\Column(type: "float")]
    #[Groups("sceneDataRecup")]
    private $opacity;

    #[ORM\Column(type: "integer")]
    #[Groups("sceneDataRecup")]
    private $filters;

    #[ORM\Column(type: "integer")]
    #[Groups("sceneDataRecup")]
    private $division;

    #[ORM\Column(type: "integer")]
    #[Groups("sceneDataRecup")]
    private $colorRange;

 
    #[ORM\Column(type: "boolean")]
    #[Groups("sceneDataRecup")]
    private $glitch;

    #[ORM\Column(type: "boolean")]
    #[Groups("sceneDataRecup")]
    private $noise;

    #[ORM\Column(type: "string", length: 255)]
    #[Groups("sceneDataRecup")]
    private $colorsValue;

    // --------- Communs settings -----------------

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: "sceneD2")]
    #[ORM\JoinColumn(nullable: false)]
    protected $user;

    #[ORM\ManyToMany(targetEntity: User::class)]
    #[ORM\JoinColumn(name: "sceneD2_id", referencedColumnName: "id", onDelete: "CASCADE")]
    #[ORM\InverseJoinColumn(name: "user_id", referencedColumnName: "id", onDelete: "CASCADE")]
    #[ORM\JoinTable(name: "user_D2artwork_like")]
    protected $likes;
 
    // --------- VICH UPLOADER-----------------

    #[ORM\Column(type: "datetime_immutable", nullable: true)]
    private $updatedAt;

    #[UploadableField(mapping: "sceneD2Images", fileNameProperty: "imageName")]
    private ?File $imageFile = null;

    //-------------------------------------------------------------------------------------------

    public function getDivFactor(): ?int
    {
        return $this->divFactor;
    }

    public function setDivFactor(int $divFactor): self
    {
        $this->divFactor = $divFactor;

        return $this;
    }

    public function getCopy(): ?int
    {
        return $this->copy;
    }

    public function setCopy(int $copy): self
    {
        $this->copy = $copy;

        return $this;
    }

    public function getDeformation(): ?int
    {
        return $this->deformation;
    }

    public function setDeformation(int $deformation): self
    {
        $this->deformation = $deformation;

        return $this;
    }

    public function getSizeFactor(): ?float
    {
        return $this->sizeFactor;
    }

    public function setSizeFactor(float $sizeFactor): self
    {
        $this->sizeFactor = $sizeFactor;

        return $this;
    }

    public function getAngle(): ?int
    {
        return $this->angle;
    }

    public function setAngle(int $angle): self
    {
        $this->angle = $angle;

        return $this;
    }

    public function getOpacity(): ?float
    {
        return $this->opacity;
    }

    public function setOpacity(float $opacity): self
    {
        $this->opacity = $opacity;

        return $this;
    }

    public function getFilters(): ?int
    {
        return $this->filters;
    }

    public function setFilters(int $filters): self
    {
        $this->filters = $filters;

        return $this;
    }

    public function getDivision(): ?int
    {
        return $this->division;
    }

    public function setDivision(int $division): self
    {
        $this->division = $division;

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

    public function getGlitch(): ?int
    {
        return $this->glitch;
    }

    public function setGlitch(int $glitch): self
    {
        $this->glitch = $glitch;

        return $this;
    }

    public function getNoise(): ?int
    {
        return $this->noise;
    }

    public function setNoise(int $noise): self
    {
        $this->noise = $noise;

        return $this;
    }

    public function getColorsValue(): ?string
    {
        return $this->colorsValue;
    }

    public function setColorsValue(string $colorsValue): self
    {
        $this->colorsValue = $colorsValue;

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
