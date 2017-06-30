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
  var DENSITY = 80; // Constant used to keep all of our masses consistant in the model.

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

    // String that can be assigned as a label for any mass
    this.specificLabel = options.specificLabel;

    this.initialPosition = initialPosition;

    // @public {read-only} Used for constructing tandems for corresponding view nodes.
    this.tandem = tandem;

    assert && assert( massValue > 0, 'Mass must be greater than 0' ); // To prevent divide by 0 errors

    // @public (read-only) {Number} mass of mass object in kg
    this.mass = massValue;
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

    // @public {Property.<Spring>} {Spring|null} is the mass attached to a Spring?
    this.springProperty = new Property( null, {
      tandem: tandem.createTandem( 'springProperty' ),
      phetioValueType: TSpring
    } );

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
        self.springForceProperty.set( 0.0 );
      }
    } );

    this.netForceProperty = new DerivedProperty( [ this.springForceProperty, this.gravityProperty ], function( springForce, gravity ) {
      return springForce - self.mass * gravity;
    } );

    this.netForceProperty.link( function( netForce ) {
      self.accelerationProperty.set( netForce / self.mass );
    } );

    this.kineticEnergyProperty = new DerivedProperty( [ this.massProperty, this.verticalVelocityProperty ], function( mass, velocity ) {
      return (1 / 2) * (mass) * (Math.pow( velocity, 2 ));
    } );

    this.gravitationalPotentialEnergyProperty = new DerivedProperty( [ this.massProperty, this.gravityProperty, this.positionProperty ], function( mass, gravity, position ) {
      return Math.abs( mass * gravity * position.y );
    } );
    //
    // this.elasticPotentialEnergyProperty = new DerivedProperty( [ this.springProperty.springConstantProperty, this.springProperty.displacementProperty ],
    //   function( springConstant, displacement ) {
    //     return (1 / 2) * springConstant * Math.pow( displacement, 2 );
    //   } );
    this.elasticPotentialEnergyProperty = new Property( 0 );

    this.springProperty.link( function( spring ) {
      if ( spring ) {
        Property.multilink( [ spring.springConstantProperty, spring.displacementProperty ],
          function( springConstant, displacement ) {
            self.elasticPotentialEnergyProperty.set( .5 * springConstant * Math.pow( displacement, 2 ) );
          } );
      }
    } );

    // Property.multilink( [
    //     this.springProperty,
    //     this.springProperty.springConstantProperty,
    //     this.springProperty.displacementProperty ],
    //   function( spring, springConstant, displacement ) {
    //     if (spring){
    //       self.elasticPotentialEnergyProperty.set(.5*springConstant*Math.pow(displacement,2));
    //     }
    //   } );

    this.totalEnergyProperty = new DerivedProperty( [
        this.kineticEnergyProperty,
        this.gravitationalPotentialEnergyProperty,
        this.elasticPotentialEnergyProperty
      ],
      function( kineticEnergy, gravitationalPotentialEnergy, elasticPotentialEnergy ) {
        return kineticEnergy + gravitationalPotentialEnergy + elasticPotentialEnergy;
      } );

    // @public {read-only} Non property model attributes
    this.isLabeled = isLabeled;
    this.color = color;
    var scalingFactor = 4; // scales the radius to desired size
    this.radius = (Math.pow( (this.mass - .01) / (DENSITY * HEIGHT_RATIO * Math.PI ), 1 / 2 ) * scalingFactor);
    this.cylinderHeight = this.radius * HEIGHT_RATIO; // height in m
    this.hookHeight = this.radius * HOOK_HEIGHT_RATIO; // height in m
    this.height = this.cylinderHeight + this.hookHeight;

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

    resetMassOnly: function() {
      var newPos = this.positionProperty.initialValue.minusXY( 0, 2 );
      this.positionProperty.set( newPos );
      this.userControlledProperty.reset();
      this.springProperty.reset();
      this.verticalVelocityProperty.reset();
    }
  } )
    ;
} );