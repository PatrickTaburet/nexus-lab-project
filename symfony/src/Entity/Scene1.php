<?php

namespace App\Entity;

use DateTimeImmutable;
use Symfony\Component\HttpFoundation\File\File;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\Scene1Repository;
use Vich\UploaderBundle\Mapping\Annotation\UploadableField;

#[ORM\Entity(repositoryClass: Scene1Repository::class)]
#[Vich\Uploadable]
class Scene1 extends BaseScene
{
    #[ORM\Column(type: "integer")]
    private $color;

    #[ORM\Column(type: "integer")]
    private $saturation;

    #[ORM\Column(type: "float")]
    private $opacity;

    #[ORM\Column(type: "float")]
    private $weight;

    #[ORM\Column(type: "integer")]
    private $numLine;

    #[ORM\Column(type: "float")]
    private $velocity;

    #[ORM\Column(type: "integer")]
    private $noiseOctave;

    #[ORM\Column(type: "float")]
    private $noiseFalloff;
    
    // --------- Communs settings -----------------

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: "Scene1")]
    #[ORM\JoinColumn(nullable: false)]
    protected $user;
    
    #[ORM\ManyToMany(targetEntity: User::class)]
    #[ORM\JoinTable(name: "user_g1artwork_like")]
    #[ORM\JoinColumn(name: "scene1_id", referencedColumnName: "id", onDelete: "CASCADE")]
    #[ORM\InverseJoinColumn(name: "user_id", referencedColumnName: "id", onDelete: "CASCADE")]
    protected $likes;

    // --------- VICH UPLOADER-----------------

    #[ORM\Column(type: "datetime_immutable", nullable: true)]
    protected ?DateTimeImmutable $updatedAt = null;
    
    #[UploadableField(mapping: "scene1Images", fileNameProperty: "imageName")]
    protected ?File $imageFile = null;

//-------------------------------------------------------------------------------------------

    public function getColor(): ?int
    {
        return $this->color;
    }

    public function setColor(?int $color): self
    {
        $this->color = $color;

        return $this;
    }

    public function getSaturation(): ?int
    {
        return $this->saturation;
    }

    public function setSaturation(?int $saturation): self
    {
        $this->saturation = $saturation;

        return $this;
    }

    public function getOpacity(): ?float
    {
        return $this->opacity;
    }

    public function setOpacity(?float $opacity): self
    {
        $this->opacity = $opacity;

        return $this;
    }

    public function getWeight(): ?float
    {
        return $this->weight;
    }

    public function setWeight(?float $weight): self
    {
        $this->weight = $weight;

        return $this;
    }

    public function getNumLine(): ?int
    {
        return $this->numLine;
    }

    public function setNumLine(?int $numLine): self
    {
        $this->numLine = $numLine;

        return $this;
    }

    public function getVelocity(): ?float
    {
        return $this->velocity;
    }

    public function setVelocity(?float $velocity): self
    {
        $this->velocity = $velocity;

        return $this;
    }

    public function getNoiseOctave(): ?int
    {
        return $this->noiseOctave;
    }

    public function setNoiseOctave(?int $noiseOctave): self
    {
        $this->noiseOctave = $noiseOctave;

        return $this;
    }

    public function getNoiseFalloff(): ?float
    {
        return $this->noiseFalloff;
    }

    public function setNoiseFalloff(?float $noiseFalloff): self
    {
        $this->noiseFalloff = $noiseFalloff;

        return $this;
    }

}
