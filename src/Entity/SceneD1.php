<?php

namespace App\Entity;

use DateTimeImmutable;
use App\Repository\SceneD1Repository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Serializer\Annotation\Groups;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

/**
 * @ORM\Entity(repositoryClass=SceneD1Repository::class) 
 * @Vich\Uploadable
 */
class SceneD1
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups ("sceneDataRecup")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups ("sceneDataRecup")
     */
    private $country1;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups ("sceneDataRecup")
     */
    private $country2;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups ("sceneDataRecup")
     */
    private $country3;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups ("sceneDataRecup")
     */
    private $country4;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups ("sceneDataRecup")
     */
    private $country5;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups ("sceneDataRecup")
     */
    private $country6;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups ("sceneDataRecup")
     */
    private $country7;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups ("sceneDataRecup")
     */
    private $country8;

    /**
     * @ORM\Column(type="float")
     * @Groups ("sceneDataRecup")
     */
    private $randomness;

    /**
     * @ORM\Column(type="boolean")
     * @Groups ("sceneDataRecup")
     */
    private $looping;

    /**
     * @ORM\Column(type="boolean")
     * @Groups ("sceneDataRecup")
     */
    private $abstract;
    
    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="sceneD1")
     * @ORM\JoinColumn(nullable=false)
     * @Groups ("sceneDataRecup")
     */
    private $user;

    // --------- VICH UPLOADER-----------------

    /**
     * @Vich\UploadableField(mapping="sceneD1Images", fileNameProperty="imageName")
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

    /**
     * @ORM\Column(type="string", length=100, nullable=true)
     */
    private $title;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $comment;



//-------------------------------------------------------------------------------------------

    public function getId(): ?int
    {
        return $this->id;
    }

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
    
    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

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

}
