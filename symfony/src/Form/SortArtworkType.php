<?php

namespace App\Form;

use Symfony\Component\Form\{
    AbstractType,
    FormBuilderInterface
};
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;


class SortArtworkType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
        ->add('sortSelect', ChoiceType::class, [
            'label' => 'Sort by ',
            'choices' => [
                'Date' => 'date',
                'Likes' => 'likes',
            ],
        ])
   
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => null,
            'attr' => [
                'id' => 'selectForm',
            ],
        ]);
    }
}
