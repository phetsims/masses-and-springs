// Copyright 2016-2017, University of Colorado Boulder

/**
 * Responsible for the model associated with each mass.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var Property = require( 'AXON/Property' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var HEIGHT_RATIO = 2;
  var HOOK_HEIGHT_RATIO = .75;
  var DENSITY = 80; // Constant used to keep all of our masses consistent in the model.

  // phet-io modules
  var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );
  var TSpring = require( 'MASSES_AND_SPRINGS/common/model/TSpring' );
  var TVector2 = require( 'DOT/TVector2' );

  /**
   * @param {number} massValue:  mass in kg
   * @param {Vector2} initialPosition: initial coordinates of the mass
   * @param {boolean} isLabeled: determines if the mass is labeled in the view
   * @param {string} color: color of shown mass
   * @param {Property.<number>} gravityProperty - the gravity property from the model
   * @param {Tandem} tandem
   * @constructor
   */
  function Mass( massValue, initialPosition, isLabeled, color, gravityProperty, tandem, options ) {
    options = _.extend( {
      specificLabel: null
    }, options );

    var self = this;

    // @public {read-only} Non-property model attributes
    this.mass = massValue;
    this.color = color;
    var scalingFactor = 4; // scales the radius to desired size
    this.radius = (Math.pow( (this.mass - .01) / (DENSITY * HEIGHT_RATIO * Math.PI ), 1 / 2 ) * scalingFactor);
    this.cylinderHeight = this.radius * HEIGHT_RATIO; // height in m
    this.hookHeight = this.radius * HOOK_HEIGHT_RATIO; // height in m
    this.height = this.cylinderHeight + this.hookHeight;

    // String that can be assigned as a label for any mass
    this.specificLabel = options.specificLabel;

    this.initialPosition = initialPosition;

    // @public {read-only} Used for constructing tandems for corresponding view nodes.
    this.tandem = tandem;

    assert && assert( massValue > 0, 'Mass must be greater than 0' ); // To prevent divide by 0 errors

    // @public (read-only) {Number} mass of mass object in kg
    this.massProperty = new Property( massValue );

    // @public Main model properties
    // {Property.<Vector2>} the position of a mass is the center top of the model object.
    this.positionProperty = new Property( this.initialPosition, {
      tandem: tandem.createTandem( 'positionProperty' ),
      phetioValueType: TVector2
    } );

    // @public {Property.<boolean>} indicates whether this mass is currently user controlled
    this.userControlledProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'userControlledProperty' )
    } );

    // @public {Property.<number>} vertical velocity of mass
    this.verticalVelocityProperty = new Property( 0, {
      tandem: tandem.createTandem( 'verticalVelocityProperty' ),
      phetioValueType: TNumber( {
        units: 'meters/second',
        range: new RangeWithValue( 0, Number.POSITIVE_INFINITY, 0 )
      } )
    } );

    // @public {Property.<number>} vertical acceleration of the mass
    this.accelerationProperty = new Property( 0, {
      tandem: tandem.createTandem( 'accelerationProperty' ),
      phetioValueType: TNumber( {
        units: 'meters/second/second',
        range: new RangeWithValue( Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, 9.8 )
      } )
    } );

    // @public {Property.<number>} vertical acceleration of the mass
    this.gravityProperty = gravityProperty;

    // REVIEW: I think {Property.<Spring|null>} is the type documentation that you're looking for.
    // @public {Property.<Spring>} {Spring|null} is the mass attached to a Spring?
    this.springProperty = new Property( null, {
      tandem: tandem.createTandem( 'springProperty' ),
      phetioValueType: TSpring
    } );

    // REVIEW: Should be initialized to a value, and the type and visibility should be documented. Also, units?
    // The force of the attached spring or 0 if unattached
    this.springForceProperty = new Property();

    // Forward the value from the attached spring through to the mass's springForceProperty
    var springForceListener = function( springForce ) {
      self.springForceProperty.set( springForce );
    };
    this.springProperty.link( function( spring, oldSpring ) {
      oldSpring && oldSpring.springForceProperty.unlink( springForceListener );
      spring && spring.springForceProperty.link( springForceListener );
      if ( !spring ) {
        self.springForceProperty.set( 0.0 ); // REVIEW: Recommend using springForceProperty.reset here once an initial value is correctly set (see comment above)
      }
    } );

    // REVIEW: Several of the derived property declaration below exceen the 120 column guideline and should be cleaned up.

    // Net force applied to mass
    this.netForceProperty = new DerivedProperty( [ this.springForceProperty, this.gravityProperty ], function( springForce, gravity ) {
      return springForce - self.mass * gravity;
    } );

    // Link that sets the acceleration property of the mass
    this.netForceProperty.link( function( netForce ) {
      self.accelerationProperty.set( netForce / self.mass );
    } );

    // Kinetic energy of the mass
    this.kineticEnergyProperty = new DerivedProperty( [ this.massProperty, this.verticalVelocityProperty ], function( mass, velocity ) {
      return (1 / 2) * (mass) * (Math.pow( velocity, 2 ));
    } );

    // Gravitational potential energy of the mass
    this.gravitationalPotentialEnergyProperty = new DerivedProperty( [ this.massProperty, this.gravityProperty, this.positionProperty ], function( mass, gravity, position ) {
      return Math.abs( mass * gravity * (position.y - self.height) );
    } );

    // Kinetic energy of the mass
    this.elasticPotentialEnergyProperty = new Property( 0 );

    // Link that sets the elastic potential energy
    this.springProperty.link( function( spring ) {
      if ( spring ) {

        // Check if mass is attached to spring first, then update the elastic potential energy
        Property.multilink(
          [ spring.springConstantProperty, spring.displacementProperty ],
          function( springConstant, displacement ) {
            self.elasticPotentialEnergyProperty.set( .5 * springConstant * Math.pow( displacement, 2 ) );
          }
        );
      }
    } );

    // Total energy of the mass
    this.totalEnergyProperty = new DerivedProperty( [
        this.kineticEnergyProperty,
        this.gravitationalPotentialEnergyProperty,
        this.elasticPotentialEnergyProperty
      ],
      function( kineticEnergy, gravitationalPotentialEnergy, elasticPotentialEnergy ) {
        return kineticEnergy + gravitationalPotentialEnergy + elasticPotentialEnergy;
      }
    );

    this.userControlledProperty.link( function( userControlled ) {
      if ( !userControlled && self.springProperty.get() ) {
        self.springProperty.get().animatingProperty.set( true );
      }
    } );
  }

  massesAndSprings.register( 'Mass', Mass );

  return inherit( Object, Mass, {

    // REVIEW: To better match PhET conventions, this should be 'step', and the prerequisite properities of 'spring'
    // and 'userControlled' should be checked within instead of in the main model as they are now.
    /**
     * Responsible for mass falling without being attached to spring.
     * @param {number} gravity
     * @param {number} floorY
     * @param {number} dt
     *
     * @public
     */
    fallWithGravity: function( gravity, floorY, dt ) {
      var floorPosition = floorY + this.height;
      var oldY = this.positionProperty.get().y;
      if ( oldY !== floorPosition ) {
        var newVerticalVelocity = this.verticalVelocityProperty.get() - gravity * dt;
        var newY = oldY + ( this.verticalVelocityProperty.get() + newVerticalVelocity ) * dt / 2;
        if ( newY < floorPosition ) {
          // if we hit the ground stop falling
          this.positionProperty.set( new Vector2( this.positionProperty.get().x, floorPosition ) );
          this.verticalVelocityProperty.set( 0 );
        }
        else {
          this.verticalVelocityProperty.set( newVerticalVelocity );
          this.positionProperty.set( new Vector2( this.positionProperty.get().x, newY ) );
        }
      }
    },

    /**
     * Detaches the mass from the spring.
     *
     * @public
     */
    detach: function() {
      this.verticalVelocityProperty.set( 0 );
      this.springProperty.set( null );
    },

    // REVIEW: Is this really an override?  Looks incorrect, since it inherits from a vanilla Object.
    /**
     * @Override
     *
     * @public
     */
    reset: function() {
      this.positionProperty.reset();
      this.userControlledProperty.reset();
      this.springProperty.reset();
      this.verticalVelocityProperty.reset();
    },

    // REVIEW: Documentation missing.
    resetMassOnly: function() {

      // REVIEW: This doesn't make much sense to me.  Why isn't the position simply reset?  And why is it different
      // from the main reset function?  And where does the 2 come from?  This should either be well documented (if there
      // is a good reason) or removed.
      var newPos = this.positionProperty.initialValue.minusXY( 0, 2 );
      this.positionProperty.set( newPos );
      this.userControlledProperty.reset();
      this.springProperty.reset();
      this.verticalVelocityProperty.reset();
    }
  } );
} );