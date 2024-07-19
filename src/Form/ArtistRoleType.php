<?php

namespace App\Form;

use App\Entity\ArtistRole;
use Symfony\Component\{
    Form\AbstractType,
    Form\FormBuilderInterface,
    Form\Extension\Core\Type\SubmitType,
    OptionsResolver\OptionsResolver
};

class ArtistRoleType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('firstname')
            ->add('name')
            ->add('bio')
            ->add('exemples')
            ->add('portfolio')
            ->add('submit', SubmitType::class, [
                'label' => 'Submit',
            ])
        ;
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => ArtistRole::class,
        ]);
    }
}
