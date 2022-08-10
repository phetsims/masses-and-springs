// Copyright 2016-2022, University of Colorado Boulder

/**
 * Responsible for the model associated with each mass.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import merge from '../../../../phet-core/js/merge.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import Easing from '../../../../twixt/js/Easing.js';
import massesAndSprings from '../../massesAndSprings.js';
import MassesAndSpringsConstants from '../MassesAndSpringsConstants.js';
import Spring from './Spring.js';

// constants
const HEIGHT_RATIO = 2.5;
const SCALING_FACTOR = 4; // scales the radius to desired size

class Mass {
  /**
   * @param {number} massValue:  mass in kg
   * @param {number} xPosition - starting x-coordinate of the mass object, offset from the first spring position
   * @param {Color} color: color of shown mass
   * @param {Property.<number>} gravityProperty - the gravity Property from the model
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( massValue, xPosition, color, gravityProperty, tandem, options ) {
    assert && assert( massValue > 0, 'Mass must be greater than 0' ); // To prevent divide by 0 errors


    options = merge( {
      adjustable: false,
      mysteryLabel: false,
      icon: false, // Determines whether this mass will be displayed as an icon.
      density: 80, // Constant used to keep all of our masses consistent in the model (kg/m^2).
      color: color,
      zeroReferencePoint: 0 // Height of the mass when it is resting on the shelf (m).
    }, options );

    // @public Non-Property attributes
    this.adjustable = options.adjustable;
    this.mysteryLabel = options.mysteryLabel;
    this.icon = options.icon;
    this.color = color.value;
    this.zeroReferencePoint = options.zeroReferencePoint;

    // @public (read-only) {Property.<number>} mass of mass object in kg
    this.massProperty = new NumberProperty( massValue );

    // @public {Property.<number>} (read-write) radius of the massNode is dependent on its mass value
    this.radiusProperty = new DerivedProperty( [ this.massProperty ], massValue => Math.pow( ( massValue ) / ( options.density * HEIGHT_RATIO * Math.PI ), 1 / 2 ) * SCALING_FACTOR );

    // @public {number}
    this.mass = massValue;

    // @public {Property.<number>} height in meters. Measured from bottom of mass object not screen.
    this.cylinderHeightProperty = new DerivedProperty( [ this.radiusProperty ],
      radius => radius * HEIGHT_RATIO );

    this.cylinderHeightProperty.link( cylinderHeight => {
      this.zeroReferencePoint = -cylinderHeight / 2;
    } );

    // @public {Property.<number>} total height of the mass, including its hook
    this.heightProperty = new DerivedProperty( [ this.cylinderHeightProperty ], cylinderHeight => cylinderHeight + MassesAndSpringsConstants.HOOK_HEIGHT );

    // @public {Tandem} (read-only) Used for constructing tandems for corresponding view nodes.
    this.massTandem = tandem;

    // @public - the position of a mass is the center top of the model object.
    this.positionProperty = new Vector2Property(
      new Vector2( xPosition, this.heightProperty.value + MassesAndSpringsConstants.SHELF_HEIGHT ), {
        tandem: tandem.createTandem( 'positionProperty' )
      } );

    // @public {DerivedProperty.<Vector2>} the position of the mass's center of mass.
    this.centerOfMassPositionProperty = new DerivedProperty( [ this.positionProperty, this.cylinderHeightProperty ],
      ( position, cylinderHeight ) => new Vector2(
        position.x,
        position.y -
        cylinderHeight / 2 -
        MassesAndSpringsConstants.HOOK_HEIGHT
      ) );

    // @private {Vector2}
    this.initialPosition = this.positionProperty.initialValue;

    // @public {Property.<boolean>} indicates whether this mass is currently user controlled
    this.userControlledProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'userControlledProperty' )
    } );

    // @private {Property.<boolean>} whether the mass is animating after being released and not attached to a spring
    this.isAnimatingProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isAnimatingProperty' )
    } );

    // @public {Property.<boolean>} indicates whether the mass is resting on its shelf.
    this.onShelfProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'onShelfProperty' )
    } );

    // @public {Property.<number>} vertical velocity of mass
    this.verticalVelocityProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'verticalVelocityProperty' ),
      units: 'm/s',
      range: new Range( Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, 0 )
    } );

    // @public {Property.<number>} vertical acceleration of the mass
    this.gravityProperty = gravityProperty;

    // @public {Property.<Spring|null>}  spring that the mass is attached to
    this.springProperty = new Property( null, {
      tandem: tandem.createTandem( 'springProperty' ),
      phetioValueType: NullableIO( Spring.SpringIO )
    } );

    // @public {Property.<number>} The force of the attached spring or 0 if unattached
    this.springForceProperty = new DynamicProperty( this.springProperty, {
      derive: 'springForceProperty',
      defaultValue: 0
    } );

    // @public {Property.<number>} Net force applied to mass
    this.netForceProperty = new DerivedProperty( [ this.springForceProperty, this.massProperty, this.gravityProperty ],
      ( springForce, massValue, gravity ) => springForce - massValue * gravity );

    // @public {Property.<number>} vertical acceleration of the mass
    this.accelerationProperty = new DerivedProperty( [ this.netForceProperty, this.massProperty ],
      ( netForce, mass ) => netForce / mass );

    // @public {Property.<number>} Kinetic energy of the mass
    this.kineticEnergyProperty = new DerivedProperty(
      [ this.massProperty, this.verticalVelocityProperty, this.userControlledProperty ],
      ( mass, velocity, userControlled ) => userControlled ? 0 : 0.5 * mass * Math.pow( velocity, 2 ) );

    // @public {Property.<number>} Gravitational potential energy of the mass
    this.gravitationalPotentialEnergyProperty = new DerivedProperty(
      [ this.massProperty, this.gravityProperty, this.positionProperty ],
      ( mass, gravity, position ) => {

        // The height used is determined based on the height of the shelf the masses rest on.
        const heightFromZero = position.y - options.zeroReferencePoint - this.heightProperty.value;
        return ( mass * gravity * ( heightFromZero ) );
      } );

    // @public {Property.<number>} Kinetic energy of the mass
    this.elasticPotentialEnergyProperty = new DynamicProperty( this.springProperty, {
      derive: 'elasticPotentialEnergyProperty',
      defaultValue: 0
    } );

    // @public {Property.<number>} (read-only) Total energy of the mass
    this.totalEnergyProperty = new DerivedProperty( [
        this.kineticEnergyProperty,
        this.gravitationalPotentialEnergyProperty,
        this.elasticPotentialEnergyProperty
      ],
      ( kineticEnergy, gravitationalPotentialEnergy, elasticPotentialEnergy ) => kineticEnergy + gravitationalPotentialEnergy + elasticPotentialEnergy
    );

    // @public {Property.<number>} Total energy of our spring system when it is initialized
    this.initialTotalEnergyProperty = new NumberProperty( 0 );

    // @public {Property.<number>} Thermal energy of the mass
    this.thermalEnergyProperty = new DerivedProperty( [ this.initialTotalEnergyProperty, this.totalEnergyProperty ],
      ( initialEnergy, totalEnergy ) => {

        // Preserving energy here so when damping is zero the thermal energy doesn't change.
        if ( this.springProperty.value && this.springProperty.value.dampingCoefficientProperty.value === 0 ) {
          this.preserveThermalEnergy = true;
        }
        return initialEnergy - totalEnergy;
      } );

    // Used to determine when a peak is hit.
    this.verticalVelocityProperty.lazyLink( ( oldVelocity, newVelocity ) => {
      if ( this.springProperty.value ) {
        if ( Math.sign( oldVelocity ) !== Math.sign( newVelocity ) && Math.sign( oldVelocity ) ) {

          // @param {number} Emitter for peek during first upwards peek
          this.springProperty.value.peakEmitter.emit( 1 );
        }
        if ( Math.sign( oldVelocity ) !== Math.sign( newVelocity.y ) && !Math.sign( oldVelocity ) ) {

          // @param {number} Emitter for peek during second downwards peek
          this.springProperty.value.peakEmitter.emit( -1 );
        }
      }
    } );

    this.userControlledProperty.link( userControlled => {
      if ( this.springProperty.value ) {

        // If the user grabs an attached mass the mass displacement should reset. Used for period trace.
        this.springProperty.value.massEquilibriumDisplacementProperty.reset();
      }
      if ( !userControlled && this.springProperty.get() ) {

        // When a user drags an attached mass it is as if they are restarting the spring system
        this.initialTotalEnergyProperty.set( this.kineticEnergyProperty.get() +
                                             this.gravitationalPotentialEnergyProperty.get() +
                                             this.elasticPotentialEnergyProperty.get() );
      }
      if ( userControlled ) {
        this.onShelfProperty.set( false );
        this.verticalVelocityProperty.reset();
      }
    } );

    // @private {boolean} Flag used to determine whether we are preserving the thermal energy.
    this.preserveThermalEnergy = true;

    // As the total energy changes we can derive the thermal energy as being the energy lost from the system
    this.totalEnergyProperty.link( ( newTotalEnergy, oldTotalEnergy ) => {
      if ( this.userControlledProperty.get() ) {
        // If a user is dragging the mass we remove the thermal energy.
        this.initialTotalEnergyProperty.set( newTotalEnergy );
      }

        // We can preserve thermal energy by adding any change to total energy to the initial energy,
      // as long as it is not in its natural oscillation
      else if ( this.preserveThermalEnergy ) {
        this.initialTotalEnergyProperty.value += newTotalEnergy - oldTotalEnergy;
      }
    } );

    // Used for animating the motion of a mass being released and not attached to the spring
    // @private {Vector2|null}
    this.animationStartPosition = null;

    // @private {Vector2|null}
    this.animationEndPosition = null;

    // @private {number} Valid values 0 <= x <= 1. Used to adjust rate of animation completion.
    this.animationProgress = 0;

    // The mass is considered to be animating if we are not controlling it and it isn't attached to a spring.
    Multilink.lazyMultilink( [ this.userControlledProperty, this.springProperty ], () => {
      this.isAnimatingProperty.set( false );
    } );

    // Set the equilibrium position when a mass value changes.
    // We do a similar process in Spring.js when the mass is attached to the spring.
    this.massProperty.link( value => {
      const spring = this.springProperty.value;
      if ( spring ) {

        // springExtension = mg/k
        const springExtensionValue = ( value * spring.gravityProperty.value ) / spring.springConstantProperty.value;
        spring.equilibriumYPositionProperty.set(
          spring.positionProperty.get().y -
          spring.naturalRestingLengthProperty.value -
          springExtensionValue
        );
        spring.massEquilibriumYPositionProperty.set(
          spring.positionProperty.get().y -
          spring.naturalRestingLengthProperty.value -
          springExtensionValue -
          this.heightProperty.value / 2 );

      }
    } );
  }


  /**
   * Responsible for mass falling or animating without being attached to spring.
   * @param {number} gravity
   * @param {number} floorY
   * @param {number} dt
   * @param {number} animationDt - dt used for the sliding animation after a mass is released
   *
   * @public
   */
  step( gravity, floorY, dt, animationDt ) {
    const floorPosition = floorY + this.heightProperty.value;

    if ( this.isAnimatingProperty.value ) {
      const distance = this.animationStartPosition.distance( this.animationEndPosition );
      if ( distance > 0 ) {

        // Adjust the speed of animation depending on the distance between the start and end
        const animationSpeed = Math.sqrt( 2 / distance );

        // Responsible for animating a horizontal motion when the mass is released and not attached to a spring.
        this.animationProgress = Math.min( 1, this.animationProgress + animationDt * animationSpeed );
        const ratio = Easing.CUBIC_IN_OUT.value( this.animationProgress );
        this.positionProperty.set(
          new Vector2( this.animationStartPosition.blend( this.animationEndPosition, ratio ).x, floorPosition ) );
      }
      else {
        this.animationProgress = 1;
      }
      if ( this.animationProgress === 1 ) {
        this.onShelfProperty.set( true );
        this.isAnimatingProperty.set( false );
      }
    }

    // If we're not animating/controlled or attached to a spring, we'll fall due to gravity
    else if ( this.springProperty.get() === null && !this.userControlledProperty.get() ) {
      const oldY = this.positionProperty.get().y;
      const newVerticalVelocity = this.verticalVelocityProperty.get() - gravity * dt;
      const newY = oldY + ( this.verticalVelocityProperty.get() + newVerticalVelocity ) * dt / 2;
      if ( newY < floorPosition ) {

        // if we hit the ground stop falling
        this.positionProperty.set( new Vector2( this.positionProperty.get().x, floorPosition ) );
        this.verticalVelocityProperty.set( 0 );

        // Responsible for animating the mass back to its initial position
        this.animationProgress = 0;
        this.animationStartPosition = this.positionProperty.value;
        this.animationEndPosition = new Vector2( this.initialPosition.x, this.positionProperty.value.y );
        if ( this.animationStartPosition.distance( this.animationEndPosition ) >= 1e-7 ) {
          this.isAnimatingProperty.set( true );
        }
        else {
          this.onShelfProperty.set( true );
        }
      }
      else {
        this.verticalVelocityProperty.set( newVerticalVelocity );
        this.positionProperty.set( new Vector2( this.positionProperty.get().x, newY ) );
      }
    }
  }

  /**
   * Detaches the mass from the spring.
   *
   * @public
   */
  detach() {
    this.verticalVelocityProperty.set( 0 );
    this.springProperty.set( null );
  }

  /**
   * @public
   */
  reset() {
    this.positionProperty.reset();
    this.onShelfProperty.reset();
    this.userControlledProperty.reset();
    this.springProperty.reset();
    this.verticalVelocityProperty.reset();
    this.massProperty.reset();
    this.isAnimatingProperty.reset();
    this.initialTotalEnergyProperty.reset();
  }
}

massesAndSprings.register( 'Mass', Mass );

export default Mass;