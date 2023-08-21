# Masses and Springs - model description

This description of the model used in Masses and Springs is intended for non-technical audience. There is a common model
that is shared for each screen. Each screen has unique control of certain model elements such as energy values, vectors,
and adjusting the mass value.

The core elements of the model revolve around the mass and spring objects.

Masses are varied in mass value, but all share the same density. Masses are aware of what spring they are attached to.
Please note that the term "mass" refers to the model object and the "mass value" refers to the mass of the object in kg.
The size of the mass also corresponds to the mass value. All calculations are made considering the center of mass of the
mass object. The methods for energy calculation are listed below:

- Kinetic Energy = ½ mv^2

- Gravitational Potential Energy = mgh

- Elastic Potential Energy = ½ kx^2

- Thermal Energy = Initial Total Energy - Current Total Energy

- Total Energy = KE + GPE + EPE

*k is the spring constant, m is mass value, h is distance from center of mass to sim floor, v is the mass velocity and x
is displacement of the spring from its equilibrium position.*

The spring object can have underdamped and overdamped oscillations depending on the coefficient value of the damping
slider. The spring will continuously oscillate if the damping coefficient is at its minimum (zero). The oscillation of
the spring is dependent on the spring constant, mass value, damping coefficient, and gravity. Changing any of these
values affects the oscillation pattern immediately. The length of the spring can be adjusted and essentially adds coils
to the spring.

The spring’s oscillation follows the general solution for damping as: ms^2+bs+k=0 with general solutions as: s=-b/2m ±
sqrt(b2-4mk)/2m. Complex number integration is used for values where b^2-4mk<0 or b^2-4mk> 0.

Vectors display the velocity, acceleration, and force acted on the mass at the center of mass. The length of the vectors
are scaled to make them the most visible to a user, but they do not correspond to any units.

Additionally, pressing the stop buttons near the springs causes the spring to stop its oscillation at its equilibrium
position. The equilibrium position and its reference line dynamically changes as the mass-spring system changes. 
