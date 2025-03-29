<?php

namespace App\Entity;

use Symfony\Component\{
    HttpFoundation\File\File,
    Serializer\Annotation\Groups
};
use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use App\Repository\SceneD1Repository;
use Vich\UploaderBundle\Mapping\Annotation\UploadableField;

#[ORM\Entity(repositoryClass: SceneD1Repository::class)]
#[Vich\Uploadable]
class SceneD1 extends BaseScene
{
    #[ORM\Column(type: "string", length: 255, nullable: true)]
    #[Groups("sceneDataRecup")]
    private $country1;

    #[ORM\Column(type: "string", length: 255, nullable: true)]
    #[Groups("sceneDataRecup")]
    private $country2;

    #[ORM\Column(type: "string", length: 255, nullable: true)]
    #[Groups("sceneDataRecup")]
    private $country3;

    #[ORM\Column(type: "string", length: 255, nullable: true)]
    #[Groups("sceneDataRecup")]
    private $country4;

    #[ORM\Column(type: "string", length: 255, nullable: true)]
    #[Groups("sceneDataRecup")]
    private $country5;

    #[ORM\Column(type: "string", length: 255, nullable: true)]
    #[Groups("sceneDataRecup")]
    private $country6;

    #[ORM\Column(type: "string", length: 255, nullable: true)]
    #[Groups("sceneDataRecup")]
    private $country7;

    #[ORM\Column(type: "string", length: 255, nullable: true)]
    #[Groups("sceneDataRecup")]
    private $country8;

    #[ORM\Column(type: "float")]
    #[Groups("sceneDataRecup")]
    private $randomness;

    #[ORM\Column(type: "boolean")]
    #[Groups("sceneDataRecup")]
    private $looping;

    #[ORM\Column(type: "boolean")]
    #[Groups("sceneDataRecup")]
    private $abstract;

    // --------- Communs settings -----------------
    
    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: "sceneD1")]
    #[ORM\JoinColumn(nullable: false)]
    protected $user;

    #[ORM\ManyToMany(targetEntity: User::class)]
    #[ORM\JoinColumn(name: "sceneD1_id", referencedColumnName: "id", onDelete: "CASCADE")]
    #[ORM\InverseJoinColumn(name: "user_id", referencedColumnName: "id", onDelete: "CASCADE")]
    #[ORM\JoinTable(name: "user_D1artwork_like")]
    protected $likes;
    
    // --------- VICH UPLOADER-----------------

    #[ORM\Column(type: "datetime_immutable", nullable: true)]
    protected ?DateTimeImmutable $updatedAt = null;


    #[UploadableField(mapping: "sceneD1Images", fileNameProperty: "imageName")]
    protected ?File $imageFile = null;

//-------------------------------------------------------------------------------------------

    public function getCountry1(): ?string
    {
        return $this->country1;
    }

    public function setCountry1(?string $country1): self
    {
        $this->country1 = $country1;

        return $this;
    }

    public function getCountry2(): ?string
    {
        return $this->country2;
    }

    public function setCountry2(?string $country2): self
    {
        $this->country2 = $country2;

        return $this;
    }

    public function getCountry3(): ?string
    {
        return $this->country3;
    }

    public function setCountry3(?string $country3): self
    {
        $this->country3 = $country3;

        return $this;
    }

    public function getCountry4(): ?string
    {
        return $this->country4;
    }

    public function setCountry4(?string $country4): self
    {
        $this->country4 = $country4;

        return $this;
    }

    public function getCountry5(): ?string
    {
        return $this->country5;
    }

    public function setCountry5(?string $country5): self
    {
        $this->country5 = $country5;

        return $this;
    }

    public function getCountry6(): ?string
    {
        return $this->country6;
    }

    public function setCountry6(?string $country6): self
    {
        $this->country6 = $country6;

        return $this;
    }

    public function getCountry7(): ?string
    {
        return $this->country7;
    }

    public function setCountry7(?string $country7): self
    {
        $this->country7 = $country7;

        return $this;
    }

    public function getCountry8(): ?string
    {
        return $this->country8;
    }

    public function setCountry8(?string $country8): self
    {
        $this->country8 = $country8;

        return $this;
    }

    public function getRandomness(): ?float
    {
        return $this->randomness;
    }

    public function setRandomness(float $randomness): self
    {
        $this->randomness = $randomness;

        return $this;
    }

    public function isLooping(): ?bool
    {
        return $this->looping;
    }

    public function setLooping(bool $looping): self
    {
        $this->looping = $looping;

        return $this;
    }

    public function isAbstract(): ?bool
    {
        return $this->abstract;
    }

    public function setAbstract(bool $abstract): self
    {
        $this->abstract = $abstract;

        return $this;
    }
}
