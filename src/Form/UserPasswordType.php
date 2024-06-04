<?php

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;


class UserPasswordType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
       
        $builder
            ->add('plainPassword', RepeatedType::class, [
                'type' => PasswordType::class,
                'invalid_message' => 'The password fields must match.',
                'options' => ['attr' => ['class' => 'password-field m-1']],
                'required' => false,
                'first_options'  => [
                    'label' => 'Password', 
                    'label_attr' => ['class' => 'label-psw'],
                    'attr' => ['class' => 'firstMdpField form-control']],
                'second_options' => [
                    'label' => 'Repeat Password', 
                    'label_attr' => ['class' => 'label-psw'],
                    'attr' => ['class' => 'secondMdpField form-control']],
                
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
            ->add('newPassword', PasswordType::class,[
                'attr' => [
                    'class' => '',
                ],
                'label' => "Add a new password",
                'label_attr' => [
                    'class' => 'label-psw',
                ],
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
            -> add('Submit', SubmitType::class, [
                'label' => 'Update',
                'attr' => [
                    'class' => 'customButton',
                ],
            ])
        ;
    }
            
}