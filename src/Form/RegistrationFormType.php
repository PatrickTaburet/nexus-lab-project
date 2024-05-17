<?php

namespace App\Form;

use App\Entity\User;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Vich\UploaderBundle\Form\Type\VichImageType;
use Symfony\Component\Validator\Constraints\IsTrue;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;

class RegistrationFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('email', EmailType::class, [
                'attr'=> [
                    'class'=>''
                ],
                'label'=> 'E-mail'
            ])
            ->add('pseudo', TextType::class, [
                'attr'=> [
                    'class'=>''
                ],
                'label'=> 'Username'
            ])
            ->add('agreeTerms', CheckboxType::class, [
                'label' => "Agree terms",
                'attr' => ['class' => 'm-2'],
                'mapped' => false,
                'constraints' => [
                    new IsTrue([
                        'message' => 'You should agree to our terms.',
                    ]),
                ],
            ])
            ->add('plainPassword', RepeatedType::class, [
                'type' => PasswordType::class,
                'invalid_message' => 'The password fields must match.',
                'options' => ['attr' => ['class' => 'password-field m-2']],
                'required' => true,
                'first_options'  => ['label' => 'Password', 'attr' => ['class' => 'passwordInput']],
                'second_options' => ['label' => 'Repeat Password', 'attr' => ['class' => 'repeatPasswordInput']],
                
                'mapped' => false,
                'attr' => ['autocomplete' => 'new-password'],
                'constraints' => [
                    new NotBlank([
                        'message' => 'Please enter a password',
                    ]),
                    new Length([
                        'min' => 6,
                        'minMessage' => 'Your password should be at least {{ limit }} characters',
                        // max length allowed by Symfony for security reasons
                        'max' => 4096,
                    ]),
                ],
            ])
            ->add('imageFile', VichImageType::class, [
                'label' => 'User picture',
                'allow_delete' => false, 
                'download_link' => false,
                'download_uri' => false,
                'image_uri' => false,
                'label_attr' => [
                    'class' => ' '
                ],
                'required' => false , // image is required only if the form is used for create
                // 'image_preview' => [
                //     'maxWidth' => '200', // Largeur maximale de prévisualisation en pixels
                //     'maxHeight' => '150', // Hauteur maximale de prévisualisation en pixels
                // ],
            ])
            
            -> add('Submit', SubmitType::class, [
                'label' => 'Register',
                'attr' => [
                    'class' => 'customButton',
                ],
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => User::class,
        ]);
    }
}
