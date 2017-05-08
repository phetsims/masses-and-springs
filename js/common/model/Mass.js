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
  var DENSITY = 80; // TODO: explain this constant

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
  function Mass( massValue, initialPosition, isLabeled, color, gravityProperty, tandem ) {
    var self = this;

    this.initialPosition=initialPosition;

    // @public {read-only} Used for constructing tandems for corresponding view nodes.
    this.tandem = tandem;

    assert && assert( massValue > 0, 'Mass must be greater than 0' ); // To prevent divide by 0 errors

    // TODO: refactor mass into massProperty
    // @public (read-only) {Number} mass of mass object in kg
    this.mass = massValue;
    this.massProperty = new Property (massValue);

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
    // TODO: use this property
    this.gravityProperty = gravityProperty; // TODO: align those names

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

    // TODO: derive net force from gravity force and spring force
    this.netForceProperty = new DerivedProperty( [ this.springForceProperty, this.gravityProperty ], function( springForce, gravity ) {
      return springForce - self.mass * gravity;
    } );

    // @public {read-only} Non property model attributes
    this.isLabeled = isLabeled;
    this.color = color;
    this.hookHeight = 0.03; // height in m
    var scalingFactor = 4; // scales the radius to desired size
    this.radius = (Math.pow( this.mass / (DENSITY * HEIGHT_RATIO * Math.PI ), 1 / 2 ) * scalingFactor);
    this.cylinderHeight = (this.radius) * HEIGHT_RATIO;
    this.height = this.cylinderHeight + this.hookHeight;

    // TODO: callback depends on 2 properties but only links to one of them
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
    }
  } )
    ;
} );