# Masses and Springs - Implementation Notes

This document contains notes that will be helpful to developers and future maintainers of this simulation.

## Model

Start by reading the model description in https://github.com/phetsims/masses-and-springs/blob/master/doc/model.md

The main model for this simulation is 'MassesAndSpringsModel', which contains the rest of the model components. The sim at its core has a set of mass and a set of spring objects. Once a mass is dragged near a spring’s bottom end it is attached and the spring oscillates once released.

The mass is responsible for its vector calculations regarding forces, velocity, and acceleration. The spring is responsible for calculating all energy values and oscillation patterns. During motion, the model will calculate new values in the mass and spring step functions. See model.md for an explanation of calculations.

Some creative liberties were taken when deciding on limit for damping coefficients to make the oscillation look smooth. There are preset gravity values attributed its respective planet and all other gravity values are custom. 

Energy values in the model are calculated for each spring independently. Energy values shown in the graph on the Lab and Energy screens are qualitative representations of the values and are unit less. Additionally, the energy values are only calculated when a spring has a mass attached. The methods for calculation are listed below:

- Kinetic Energy = ½ mv^2

- Gravitational Potential Energy = mgh

- Elastic Potential Energy = ½ kx^2

- Thermal Energy = Initial Total Energy - Current Total Energy

- Total Energy = KE + GPE + EPE

*k is the spring constant, m is mass value, h is distance from center of mass to sim floor, and x is displacement of the spring from its equilibrium position.*

The model is able to account for an adjustable mass value and responds dynamically.

## View

There is a model view transform that is used throughout the sim to convert view elements to model elements or vice versa. The masses are represented by massNodes and they are bounded by the screen’s visible bounds unless they are attached to a spring and oscillating. The user is limited on how far they can prime a spring’s oscillation by the visible bounds of the sim window and the number of coils on a spring.

Vectors are used for visual representation only and are unitless.

When a mass is dropped it falls as a free object at the rate of gravity and animates back to its home location on the mass shelf. This second animation back to its home location is completely independent from the model and is only in place to organize fallen masses. It will animate independent of sim playback speed as well.

## Memory Management

All objects exist for the life of the sim, and there is no need to dynamically create or destroy objects. All listeners added to observable Properties also exist for the lifetime of the sim. There is no need to use the various memory management functions such as unlink, dispose, detach, and so on.

