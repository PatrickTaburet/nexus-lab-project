<?php

namespace App\Form;

use Symfony\Component\Form\Extension\Core\Type\{
    TextType,
    SubmitType,
    TextareaType
};
use Symfony\Component\Form\{
    AbstractType,
    FormBuilderInterface
};
use Symfony\Component\{
    Validator\Constraints\NotBlank,
    OptionsResolver\OptionsResolver
};

abstract class BaseSaveArtworkType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('title', TextType::class, [
                'constraints' => [
                    new NotBlank(),
                ],
                'attr' => [
                    'maxlength' => 36,
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
            ]);
    }

    abstract protected function getDataClass(): string;

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => $this->getDataClass(),
        ]);
    }
}
