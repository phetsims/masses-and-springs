// Copyright 2016-2022, University of Colorado Boulder

/**
 * Responsible for the attributes associated with each spring.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Complex from '../../../../dot/js/Complex.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import massesAndSprings from '../../massesAndSprings.js';
import MassesAndSpringsConstants from '../MassesAndSpringsConstants.js';

// constants
const DEFAULT_THICKNESS = 3; // empirically determined

class Spring {
  /**
   * @param {Vector2} position - coordinates of the top center of the spring
   * @param {number} initialNaturalRestingLength - initial resting length of unweighted spring in m
   * @param {Property.<number>} dampingProperty - used for viscous damping coefficient (N.s/m) of the system
   * @param {Property.<number>} gravityProperty - the gravity Property from the model
   * @param {Tandem} tandem
   *
   */
  constructor( position, initialNaturalRestingLength, dampingProperty, gravityProperty, tandem ) {

    // validate and save options
    assert && assert( initialNaturalRestingLength > 0, `naturalRestingLength must be > 0 : ${
      initialNaturalRestingLength}` );

    // @public {Property.<number>} (read-write) Used to position massNode forces. Right side: 1, Left side: -1
    this.forcesOrientationProperty = new NumberProperty( 1 );

    // @public {Property.<number|null>} gravitational acceleration
    this.gravityProperty = new Property( gravityProperty.value, {
      reentrant: true // used due to extremely small rounding
    } );

    // Link to manage gravity value for the spring object. Springs exists throughout sim lifetime so no need for unlink.
    gravityProperty.link( gravity => {
      this.gravityProperty.set( gravity );
    } );

    //  @public {Property.<number>} distance from the bottom of the spring from the natural resting position
    this.displacementProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'displacementProperty' ),
      units: 'm',
      range: new Range( Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY )
    } );

    // @public {Property.<number>} y position of the equilibrium position centered on mass's center of mass
    this.massEquilibriumYPositionProperty = new NumberProperty( 0,
      {
        tandem: tandem.createTandem( 'equilibriumYPositionProperty' ),
        units: 'm',
        range: new Range( Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY )
      } );

    // @public {Property.<number|null>} distance from of the bottom of the spring from the massEquilibriumYPosition
    this.massEquilibriumDisplacementProperty = new Property( null );

    // @public {Property.<number>} spring constant of spring
    this.springConstantProperty = new NumberProperty( MassesAndSpringsConstants.SPRING_CONSTANT_RANGE.defaultValue, {
      tandem: tandem.createTandem( 'springConstantProperty' ),
      units: 'N/m',
      range: new Range( 3, 60 )
    } );

    // @public {Property.<number>} spring force
    this.springForceProperty = new DerivedProperty(
      [ this.displacementProperty, this.springConstantProperty ],
      ( displacement, springConstant ) => -springConstant * displacement,
      {
        units: 'N',
        phetioValueType: NumberIO
      }
    );

    // @public {Property.<number>} viscous damping coefficient of the system
    this.dampingCoefficientProperty = new NumberProperty( dampingProperty.value, {
      tandem: tandem.createTandem( 'dampingCoefficientProperty' ),
      units: 'N\u00b7s/m',
      range: new Range( Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY )
    } );

    // @public - position of the spring, originated at the top-center of the spring node
    this.positionProperty = new Vector2Property( position, {
      tandem: tandem.createTandem( 'positionProperty' )
    } );

    // @public {Property.<number>} length of the spring without mass attached
    this.naturalRestingLengthProperty = new NumberProperty( initialNaturalRestingLength, {
      tandem: tandem.createTandem( 'naturalRestingLengthProperty' ),
      units: 'm',
      range: new Range( 0.1, 0.5 )
    } );

    // @public {Property.<number> read-only} line width of oscillating spring node
    this.thicknessProperty = new NumberProperty( DEFAULT_THICKNESS, {
      tandem: tandem.createTandem( 'thicknessProperty' ),
      range: new Range( Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY )
    } );

    // Calling this function here will set a calculated value for the thickness property.
    this.updateThickness( this.naturalRestingLengthProperty.get(), this.springConstantProperty.get() );

    // @public {Property.<boolean>} determines whether the animation for the spring is played or not
    this.animatingProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'animatingProperty' )
    } );

    // @public {Property.<Mass|null> read-write} This is the Mass object that is attached to the spring
    this.massAttachedProperty = new Property( null, {
      tandem: tandem.createTandem( 'massAttachedProperty' )
      // phetioValueType: NullableIO( MassIO )
    } );

    // @public {Property.<number>} Kinetic Energy of the attached Mass
    this.kineticEnergyProperty = new DynamicProperty( this.massAttachedProperty, {
      derive: 'kineticEnergyProperty',
      defaultValue: 0
    } );

    // @public {Property.<number>} Gravitational Potential Energy of the attached Mass
    this.gravitationalPotentialEnergyProperty = new DynamicProperty( this.massAttachedProperty, {
      derive: 'gravitationalPotentialEnergyProperty',
      defaultValue: 0
    } );

    // @public {Property.<number>} Elastic Potential Energy of the attached Mass
    this.elasticPotentialEnergyProperty = new DerivedProperty(
      [ this.springConstantProperty, this.displacementProperty ],
      ( springConstant, displacement ) => 0.5 * springConstant * Math.pow( ( displacement ), 2 ) );

    // @public {Property.<number>} Thermal Energy of the attached Mass
    this.thermalEnergyProperty = new DynamicProperty( this.massAttachedProperty, {
      derive: 'thermalEnergyProperty',
      defaultValue: 0
    } );

    // @public {Property.<boolean>} Flag to enable the stop button for the spring.
    this.buttonEnabledProperty = new BooleanProperty( false );

    // @public {Property.<number>} (read-only) length of the spring, units = m
    this.lengthProperty = new DerivedProperty(
      [ this.naturalRestingLengthProperty, this.displacementProperty ],
      ( naturalRestingLength, displacement ) => naturalRestingLength - displacement,
      {
        tandem: tandem.createTandem( 'lengthProperty' ),
        units: 'm',
        range: new Range( 0, Number.POSITIVE_INFINITY ),
        phetioValueType: NumberIO
      }
    );

    // @public {Property.<number>} (read-only) y position of the bottom end of the spring, units = m
    this.bottomProperty = new DerivedProperty(
      [ this.positionProperty, this.lengthProperty ],
      ( position, length ) => position.y - length,
      {
        tandem: tandem.createTandem( 'bottomProperty' ),
        units: 'm',
        range: new Range( 0, Number.POSITIVE_INFINITY ),
        phetioValueType: NumberIO
      }
    );

    // Links are used to set damping Property of each spring to the damping property of the system
    dampingProperty.link( newDamping => {
      assert && assert( newDamping >= 0, `damping must be greater than or equal to 0: ${newDamping}` );
      this.dampingCoefficientProperty.set( newDamping );
    } );

    // @public {Property.<number>}(read-only) y position of the equilibrium position
    this.equilibriumYPositionProperty = new NumberProperty( 0,
      {
        tandem: tandem.createTandem( 'equilibriumYPositionProperty' ),
        units: 'm',
        range: new Range( Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY )
      } );

    // Set the equilibrium position when a mass is attached to the spring.
    // We do a similar process in Mass.js when the mass value changes.
    Multilink.multilink( [
        this.springConstantProperty,
        this.gravityProperty,
        this.massAttachedProperty,
        this.naturalRestingLengthProperty
      ],
      ( springConstant, gravity, mass, naturalRestingLength ) => {
        if ( mass ) {

          // springExtension = mg/k
          const springExtension = ( mass.massProperty.value * this.gravityProperty.value ) / this.springConstantProperty.value;

          //Set equilibrium y position
          this.equilibriumYPositionProperty.set(
            this.positionProperty.get().y - naturalRestingLength - springExtension );

          // Set mass equilibrium y position
          this.massEquilibriumYPositionProperty.set(
            this.positionProperty.get().y - naturalRestingLength - springExtension - mass.heightProperty.value / 2
          );
        }
      } );

    // @public {Property.<number>} y position of the equilibrium position centered on mass's center of mass
    this.massEquilibriumYPositionProperty = new NumberProperty( 0,
      {
        tandem: tandem.createTandem( 'equilibriumYPositionProperty' ),
        units: 'm',
        range: new Range( Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY )
      } );

    const massCenterOfMassProperty = new DynamicProperty( this.massAttachedProperty, {
      derive: 'centerOfMassPositionProperty',
      defaultValue: null
    } );

    Multilink.multilink( [ this.massEquilibriumYPositionProperty, massCenterOfMassProperty ],
      ( massEquilibriumYPosition, massCenterOfMass ) => {
        if ( massCenterOfMass !== null ) {
          this.massEquilibriumDisplacementProperty.set( massCenterOfMass.y - massEquilibriumYPosition );
        }
      } );

    // Set the equilibrium position when a mass is attached to the spring.
    // We do a similar process in Mass.js when the mass value changes.
    Multilink.multilink( [
        this.springConstantProperty,
        this.gravityProperty,
        this.massAttachedProperty,
        this.naturalRestingLengthProperty
      ],
      ( springConstant, gravity, mass, naturalRestingLength ) => {
        if ( mass ) {

          // springExtension = mg/k
          const springExtensionValue =
            ( mass.massProperty.value * this.gravityProperty.value ) / this.springConstantProperty.value;
          this.massEquilibriumYPositionProperty.set(
            this.positionProperty.get().y - naturalRestingLength - springExtensionValue - mass.heightProperty.value / 2
          );
        }
      } );

    this.springConstantProperty.link( springConstant => {
      this.updateThickness( this.naturalRestingLengthProperty.get(), springConstant );
    } );

    // When the length of the spring is adjusted we need to adjust the position of the attached mass.
    this.naturalRestingLengthProperty.link( () => {
      if ( this.massAttachedProperty.value ) {
        this.setMass( this.massAttachedProperty.get() );
      }
    } );

    // @public {null|PeriodTrace} The spring should be aware of its period trace.
    // See https://github.com/phetsims/masses-and-springs-basics/issues/58
    this.periodTrace = null;

    // @public {Property.<boolean>} Responsible for the visibility of the period trace. Used in a verticalCheckboxGroup
    this.periodTraceVisibilityProperty = new BooleanProperty( false );

    // @public {Emitter} used to determine when the period tracer should alternate directions
    this.peakEmitter = new Emitter( { parameters: [ { valueType: 'number' } ] } );

    // @public {Emitter} used to determine when the mass has crossed over its equilibrium position while oscillating
    this.crossEmitter = new Emitter();

    // @public {Emitter} used to determine when to reset the periodTrace state
    this.periodTraceResetEmitter = new Emitter();

    this.massEquilibriumDisplacementProperty.link( ( newValue, oldValue ) => {
      if ( ( oldValue >= 0 ) !== ( newValue >= 0 ) && oldValue !== null && newValue !== null ) {
        this.crossEmitter.emit();
      }
    } );
  }

  /**
   * @public
   */
  reset() {
    this.buttonEnabledProperty.reset();
    this.gravityProperty.reset();
    this.displacementProperty.reset();
    this.dampingCoefficientProperty.reset();
    this.positionProperty.reset();
    this.naturalRestingLengthProperty.reset();
    this.massAttachedProperty.reset();
    this.springConstantProperty.reset();
    this.animatingProperty.reset();
    this.massEquilibriumDisplacementProperty.reset();
    this.periodTraceVisibilityProperty.reset();
  }

  /**
   * Retains the properties of the spring in an object that can publicly accessed.
   * @public
   *
   * @returns {Object}
   */
  getSpringState() {
    return {
      displacement: this.displacementProperty.get(),
      gravity: this.gravityProperty.get(),
      dampingCoefficient: this.dampingCoefficientProperty.get(),
      position: this.positionProperty.get(),
      naturalRestingLength: this.naturalRestingLengthProperty.get(),
      mass: this.massAttachedProperty.get(),
      springConstant: this.springConstantProperty.get(),
      thickness: this.thicknessProperty.get()
    };
  }

  /**
   * Sets the properties of the spring with previously stored properties.
   * @param {Object} springState - Sets the springs's properties with previously stored properties. See getSpringState
   *
   * @public
   */
  setSpringState( springState ) {
    this.displacementProperty.set( springState.displacement );
    this.gravityProperty.set( springState.gravity );
    this.dampingCoefficientProperty.set( springState.dampingCoefficient );
    this.positionProperty.set( springState.position );
    this.naturalRestingLengthProperty.set( springState.naturalRestingLength );
    this.massAttachedProperty.set( springState.mass );
    this.springConstantProperty.set( springState.springConstant );
    this.thicknessProperty.set( springState.thickness );
  }

  /**
   * Updates thickness of spring and sets its thickness Property to calculated value. This is not handled internally
   * by the spring because the intro model determines the conditions for updating thickness.
   * @public
   *
   * @param {number} length  natural resting length of spring
   * @param {number} springConstant current spring constant of spring
   */
  updateThickness( length, springConstant ) {

    // We are increasing the significance of the spring constant term by adding an exponent,
    // which is empirically determined.
    const thickness = this.thicknessProperty.initialValue
                      * springConstant / this.springConstantProperty.initialValue
                      * length / this.naturalRestingLengthProperty.initialValue;
    this.thicknessProperty.set( thickness );
  }

  /**
   * Updates springConstant of spring and sets its spring constant Property to calculated value. This is not handled
   * internally by the spring because the intro model determines the conditions for updating spring constant.
   * @public
   *
   * @param length {number} current natural resting length of spring
   * @param thickness number {number} current thickness of spring
   */
  updateSpringConstant( length, thickness ) {
    const springConstant = this.naturalRestingLengthProperty.initialValue / length
                           * thickness / this.thicknessProperty.initialValue
                           * this.springConstantProperty.initialValue;

    this.springConstantProperty.set( springConstant );
  }

  /**
   * Removes mass from spring.
   *
   * @public
   */
  removeMass() {
    if ( this.massAttachedProperty.get() ) {
      this.massAttachedProperty.get().detach();
    }
    this.displacementProperty.set( 0 );
    this.massAttachedProperty.set( null );
    this.buttonEnabledProperty.set( false );
  }

  /**
   * Updates the displacement Property of the spring.
   * @param {number} yPosition
   * @param {boolean} factorNaturalLength
   *
   * @public
   */
  updateDisplacement( yPosition, factorNaturalLength ) {
    if ( factorNaturalLength ) {
      this.displacementProperty.set( this.massAttachedProperty.value.positionProperty.value.y -
                                     ( yPosition - this.naturalRestingLengthProperty.value )
                                     - MassesAndSpringsConstants.HOOK_CENTER );
    }
    else {

      this.displacementProperty.set( -( this.positionProperty.value.y - this.naturalRestingLengthProperty.value )
                                     + yPosition - MassesAndSpringsConstants.HOOK_CENTER );
    }
  }

  /**
   * Sets mass on spring
   * @param {Mass} mass
   *
   * @public
   */
  setMass( mass ) {
    if ( this.massAttachedProperty.get() ) {
      this.massAttachedProperty.get().detach();
    }
    this.massAttachedProperty.set( mass );
    this.massAttachedProperty.get().springProperty.set( this );
    this.updateDisplacement( this.positionProperty.value.y, true );
    this.massAttachedProperty.get().verticalVelocityProperty.set( 0 );
  }

  /**
   * Stop spring motion by setting the displacement to the spring's extension, which is the length from the natural
   * resting position. This will also stop the spring from further oscillation.
   *
   * @public
   */
  stopSpring() {

    // check if mass attached on spring
    if ( this.massAttachedProperty.get() ) {
      const mass = this.massAttachedProperty.get();
      mass.initialTotalEnergyProperty.set( mass.totalEnergyProperty.value );

      // set displacement and stop further animation
      const springExtensionValue = ( mass.massProperty.value * this.gravityProperty.value ) / this.springConstantProperty.value;
      this.displacementProperty.set( -springExtensionValue );

      // place that mass at the correct position as well
      mass.positionProperty.set( new Vector2(
        this.positionProperty.get().x, this.equilibriumYPositionProperty.get() + MassesAndSpringsConstants.HOOK_CENTER
      ) );
      mass.verticalVelocityProperty.set( 0 );
      this.buttonEnabledProperty.set( false );
    }
  }

  /**
   * Responsible for oscillatory motion of spring system.
   * @public
   *
   * The motion is based off of a driven harmonic oscillator
   * (https://en.wikipedia.org/wiki/Harmonic_oscillator#Driven_harmonic_oscillators), which satisfies the
   * differential equation:
   *
   * x''(t) + 2ζω₀ x'(t) + ω₀² x(t) = -g
   *
   * where `t` is the time, `g` is the gravitational acceleration constant, and for our case we apply the
   * substitutions:
   *
   * ζ = sqrt(k/m)
   * ω₀ = c/(2 * sqrt(m*k))
   *
   * The solution to the differential equation gives essentially two different cases:
   * - Underdamped/overdamped (c²-4km != 0) where we can actually solve both with the same code by using complex
   *   numbers.
   * - Critically damped (c²-4km = 0), which would cause division by zero in the above case, so a different formula
   *   is needed.
   *
   * The formulas were easiest to compute in Mathematica (see assets/mass-spring-lab.nb), but essentially we use the
   * built-in solver and simplifier for both cases:
   *
   * For the overdamped/underdamped case:
   *   FullSimplify[
   *    DSolve[{(x''[t] + 2*zeta*omega0*x'[t] + omega0^2*x[t] == -g) /. subs,
   *       x'[0] == v1, x[0] == x1}, x[t], t], {Element[t, Reals],
   *     Element[v1, Reals], Element[x1, Reals], Element[m, Reals],
   *     Element[g, Reals], Element[c, Reals], Element[k, Reals], m > 0,
   *     g > 0, c >= 0, k > 0, c^2 < 4*k*m}]
   *
   * Resulting in:
   *   1/(2 k^(3/2) Sqrt[c^2-4 k m]) E^(-((t (c+I Sqrt[4 k m-c^2]))/(2 m))) (c Sqrt[k] (-1+E^((I t Sqrt[4 k m-c^2])/m))
   *   (g m+k x1)+I g m Sqrt[k (4 k m-c^2)] (E^((I t Sqrt[4 k m-c^2])/m)-2 E^((t (c+I Sqrt[4 k m-c^2]))/(2 m))+1)+2
   *   k^(3/2) m v1 E^((I t Sqrt[4 k m-c^2])/m)+I x1 Sqrt[k^3 (4 k m-c^2)] E^((I t Sqrt[4 k m-c^2])/m)+I x1 Sqrt[k^3
   *   (4 k m-c^2)]-2 k^(3/2) m v1)
   *
   * For the critically damped case:
   *   FullSimplify[
   *    DSolve[{(x''[t] + 2*zeta*omega0*x'[t] + omega0^2*x[t] == -g) /.
   *        subs /. {c -> Sqrt[4*k*m]}, x'[0] == v1, x[0] == x1}, x[t],
   *     t], {Element[t, Reals], Element[v1, Reals], Element[x1, Reals],
   *     Element[m, Reals], Element[g, Reals], Element[k, Reals], m > 0,
   *     g > 0, k > 0}]
   *
   * Resulting in:
   *   (E^(t (-Sqrt[(k/m)])) (g (m (-E^(t Sqrt[k/m]))+t Sqrt[k m]+m)+k (t (x1 Sqrt[k/m]+v1)+x1)))/k
   *
   * The code below basically factors out common subexpressions of these formulas, making them more efficient to
   * compute.
   *
   * We can use them by essentially using `t` as the timestep (dt), to compute the change for any arbitrary dt.
   * Only the constants need to be plugged in, and only the position/velocity are smoothly varying over time.
   *
   * @param {number} dt - animation time step
   */
  step( dt ) {
    if ( this.massAttachedProperty.get() && !this.massAttachedProperty.get().userControlledProperty.get() ) {
      this.massAttachedProperty.get().preserveThermalEnergy = false;

      const k = this.springConstantProperty.get();
      const m = this.massAttachedProperty.get().massProperty.get();
      const c = this.dampingCoefficientProperty.get();
      const v = this.massAttachedProperty.get().verticalVelocityProperty.get();
      const x = this.displacementProperty.get();
      const g = this.gravityProperty.get();

      // Underdamped and Overdamped case
      if ( ( c * c - 4 * k * m ) !== 0 ) {
        // Precompute expressions used more than twice (for performance).
        const km = k * m;
        const gm = g * m;
        const tDm = dt / m;
        const kx = k * x;
        const c2 = c * c;
        const kR2 = Math.sqrt( k );
        const k3R2 = k * kR2;
        const twok3R2mv = Complex.real( 2 * k3R2 * m * v );
        const alpha = Complex.real( 4 * km - c2 ).sqrt();
        const alphaI = alpha.times( Complex.I );
        const alphaPrime = Complex.real( c2 - 4 * km ).sqrt();
        const alphatD2m = Complex.real( tDm / 2 ).multiply( alpha );
        const beta = Complex.real( tDm ).multiply( alphaI ).exponentiate();
        const eta = Complex.real( c ).add( alphaI ).multiply( Complex.real( tDm / 2 ) ).exponentiate()
          .multiply( Complex.real( 2 ) );

        // Calculate new displacement
        let coef = Complex.ONE.dividedBy( Complex.real( k3R2 ).multiply( alphaPrime ).multiply( eta ) );
        let A = beta.minus( Complex.ONE ).multiply( Complex.real( c * kR2 * ( gm + kx ) ) );
        let B = Complex.real( gm * kR2 ).multiply( alphaI ).multiply(
          beta.minus( eta ).add( Complex.ONE )
        );
        const C = twok3R2mv.times( beta );
        const D = Complex.real( k3R2 * x ).multiply( alphaI );
        const E = D.times( beta );
        let newDisplacement = coef.multiply( A.add( B ).add( C ).add( D ).add( E ).subtract( twok3R2mv ) ).real;

        // Calculate new velocity
        coef = Complex.real( -( Math.exp( ( -c * dt ) / ( 2 * m ) ) ) / ( 2 * k3R2 * m ) ).divide( alphaPrime )
          .multiply( Complex.I );
        A = alphatD2m.sinOf().multiply(
          Complex.real( kR2 * ( gm + kx ) )
            .multiply( alpha.squared().add( Complex.real( c2 ) ) )
            .add( twok3R2mv.times( Complex.real( c ) ) ) );
        B = alphatD2m.cos().multiply( twok3R2mv ).multiply( alpha ).multiply( Complex.real( -1 ) );
        const newVelocity = A.add( B ).multiply( coef ).real;

        //  Stop the alternation between +/- in overdamped displacement
        if ( ( c * c - 4 * k * m ) > 0 ) {
          newDisplacement =
            ( this.displacementProperty.get() > 0 ) ? Math.abs( newDisplacement ) : -Math.abs( newDisplacement );
        }

        // In this case ( c * c - 4 * k m < 0 ) and we are underdamped.
        // Squelch noise after coming to rest with tolerance of 1 micron
        if ( Math.abs( this.displacementProperty.get() - newDisplacement ) < 1e-6 &&
             Math.abs( this.massAttachedProperty.get().verticalVelocityProperty.get() ) < 1e-6 ) {
          this.displacementProperty.set( -m * g / k );  // Equilibrium length
          this.massAttachedProperty.get().verticalVelocityProperty.set( 0 );
        }
        else {
          this.displacementProperty.set( newDisplacement );
          this.massAttachedProperty.get().verticalVelocityProperty.set( newVelocity );
        }

        assert && assert( !isNaN( this.displacementProperty.get() ), 'displacement must be a number' );
        assert && assert( !isNaN( this.massAttachedProperty.get().verticalVelocityProperty.get() ), 'velocity must be a number' );

      }

      // Critically damped case
      else {
        const omega = Math.sqrt( k / m );
        const phi = Math.exp( dt * omega );

        this.displacementProperty.set( ( g * ( -m * phi + dt * Math.sqrt( k * m ) + m ) +
                                         k * ( dt * ( x * omega + v ) + x )
                                       ) / ( phi * k ) );
        this.massAttachedProperty.get().verticalVelocityProperty.set( ( g * m * ( Math.sqrt( k * m ) - omega * ( m + dt * Math.sqrt( k * m ) ) ) -
                                                                        k * ( m * v * ( omega * dt - 1 ) + k * dt * x )
                                                                      ) / ( phi * k * m ) );
      }

      this.massAttachedProperty.get().positionProperty.set(
        new Vector2( this.positionProperty.get().x, this.bottomProperty.get() + MassesAndSpringsConstants.HOOK_CENTER )
      );

      this.buttonEnabledProperty.set( this.massAttachedProperty.get().verticalVelocityProperty.get() !== 0 );
      this.massAttachedProperty.get().preserveThermalEnergy = true;
    }
  }
}

massesAndSprings.register( 'Spring', Spring );

Spring.SpringIO = new IOType( 'SpringIO', {
  valueType: Spring,
  documentation: 'Hangs from the ceiling and applies a force to any attached BodyIO',
  supertype: ReferenceIO( IOType.ObjectIO )
} );

export default Spring;