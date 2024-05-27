<?php

namespace App\Form;

use App\Entity\Scene1;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;

class SaveArtworkG1Type extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('title', TextType::class, [
                'constraints' => [
                    new NotBlank(),
                ],
                'label' => 'Title',
            ])
            ->add('comment', TextareaType::class, [
                'label' => 'Comment',
                'constraints' => [
                    new NotBlank(),
                ],
                'attr' => [
                    'maxlength' => 255,
                ],
            ])
            ->add('submit', SubmitType::class, [
                'label' => 'Submit',
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Scene1::class,
        ]);
    }
}
