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
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var Color = require( 'SCENERY/util/Color' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Property = require( 'AXON/Property' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var HEIGHT_RATIO = 2.5;
  var HOOK_HEIGHT_RATIO = 0.75;
  var DENSITY = 80; // Constant used to keep all of our masses consistent in the model.

  // phet-io modules
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
    var self = this;

    this.options = _.extend( {
      adjustable: false,
      isLabeled: isLabeled,
      mysteryLabel: false,
      color: new Color( color )
    }, options );

    this.scalingFactor = 4; // scales the radius to desired size

    // @public {Property.<number>} radius of the massNode dependent its mass value
    this.radiusProperty = new Property( (Math.pow( (massValue - .01) / (DENSITY * HEIGHT_RATIO * Math.PI ), 1 / 2 ) * this.scalingFactor) );

    // @public {read-only} Non-property model attributes
    this.mass = massValue;
    this.color = color;

    // @public Property.<number> height in m
    this.cylinderHeightProperty = new DerivedProperty( [ this.radiusProperty ],
      function( radius ) {
        return radius * HEIGHT_RATIO;
      } );

    // @public Property.<number> hook height in m
    this.hookHeightProperty = new DerivedProperty( [ this.radiusProperty ], function( radius ) {
      return radius * HOOK_HEIGHT_RATIO;
    } );

    this.height = this.cylinderHeightProperty.get() + this.hookHeightProperty.get();
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
    this.verticalVelocityProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'verticalVelocityProperty' ),
      units: 'meters/second',
      range: new RangeWithValue( Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, 0 )
    } );

    // @public {Property.<number>} vertical acceleration of the mass
    this.accelerationProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'accelerationProperty' ),
      units: 'meters/second/second',
      range: new RangeWithValue( Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, 9.8 )
    } );

    // @public {Property.<number>} vertical acceleration of the mass
    this.gravityProperty = gravityProperty;

    // @public {Property.<Spring|null>}  spring that the mass is attached to
    this.springProperty = new Property( null, {
      tandem: tandem.createTandem( 'springProperty' ),
      phetioValueType: TSpring
    } );

    // @public {Property.<number>} The force of the attached spring or 0 if unattached
    this.springForceProperty = new NumberProperty( 0.0, {
      tandem: tandem.createTandem( 'springForceProperty' ),
      units: 'newtons/meters',
      range: new RangeWithValue( Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, 0.0 )
    } );

    // Forward the value from the attached spring through to the mass's springForceProperty
    var springForceListener = function( springForce ) {
      self.springForceProperty.set( springForce );
    };
    this.springProperty.link( function( spring, oldSpring ) {
      oldSpring && oldSpring.springForceProperty.unlink( springForceListener );
      spring && spring.springForceProperty.link( springForceListener );
      if ( !spring ) {
        self.springForceProperty.reset();
      }
    } );

    // Net force applied to mass
    this.netForceProperty = new DerivedProperty( [ this.springForceProperty, this.gravityProperty ],
      function( springForce, gravity ) {
        return springForce - self.mass * gravity;
      } );

    // Link that sets the acceleration property of the mass
    this.netForceProperty.link( function( netForce ) {
      self.accelerationProperty.set( netForce / self.mass );
    } );

    // Kinetic energy of the mass
    this.kineticEnergyProperty = new DerivedProperty( [ this.massProperty, this.verticalVelocityProperty, this.userControlledProperty ],
      function( mass, velocity, userControlled ) {
        return userControlled ? 0 : (1 / 2) * (mass) * (Math.pow( velocity, 2 ));
      } );

    // Gravitational potential energy of the mass
    this.gravitationalPotentialEnergyProperty = new DerivedProperty(
      [ this.massProperty, this.gravityProperty, this.positionProperty ],
      function( mass, gravity, position ) {
        return Math.abs( mass * gravity * (position.y - self.height) );
      } );

    // Kinetic energy of the mass
    this.elasticPotentialEnergyProperty = new Property( 0 );

    // Thermal energy of the mass
    this.thermalEnergyProperty = new Property( 0 );

    // Link that sets the elastic potential energy
    this.springProperty.link( function( spring ) {
      if ( spring ) {

        // Check if mass is attached to spring first, then update the elastic potential energy
        Property.multilink(
          [ spring.springConstantProperty, spring.displacementProperty ],
          function( springConstant, displacement ) {
            self.elasticPotentialEnergyProperty.set( 0.5 * springConstant * Math.pow( displacement, 2 ) );
          }
        );
      }
    } );

    // Total energy of the mass
    this.initialTotalEnergy = this.kineticEnergyProperty.get() +
                              this.gravitationalPotentialEnergyProperty.get() +
                              this.elasticPotentialEnergyProperty.get();

    this.totalEnergyProperty = new DerivedProperty( [
        this.kineticEnergyProperty,
        this.gravitationalPotentialEnergyProperty,
        this.elasticPotentialEnergyProperty
      ],
      function( kineticEnergy, gravitationalPotentialEnergy, elasticPotentialEnergy ) {
        var totalEnergy = kineticEnergy + gravitationalPotentialEnergy + elasticPotentialEnergy;
        self.thermalEnergyProperty.set( totalEnergy - self.initialTotalEnergy );
        return totalEnergy;
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

    /**
     * Responsible for mass falling without being attached to spring.
     * @param {number} gravity
     * @param {number} floorY
     * @param {number} dt
     *
     * @public
     */
    step: function( gravity, floorY, dt ) {
      if ( this.springProperty.get() === null && !this.userControlledProperty.get() ) {
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

    setRadius: function( massValue ) {
      this.radiusProperty.set( (Math.pow( (massValue - .01) / (DENSITY * HEIGHT_RATIO * Math.PI ), 1 / 2 ) * this.scalingFactor) );
    },

    /**
     * @public
     */
    reset: function() {
      this.positionProperty.reset();
      this.userControlledProperty.reset();
      this.springProperty.reset();
      this.verticalVelocityProperty.reset();
    }
  } );
} )
;