// Copyright 2016, University of Colorado Boulder

/**
 * Responsible for the attributes associated with each mass node.
 *
 * @author Matt Pennington
 * @author Denzell Barnett
 */

define( function( require ) {
  'use strict';

  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var HEIGHT_RATIO = 2;
  var DENSITY = 80; // density of ???

  // phet-io modules
  var TBoolean = require( 'ifphetio!PHET_IO/types/TBoolean' );
  var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );

  /**
   * @param {number} massValue:  mass in kg
   * @param {Vector2} initialPosition: initial coordinates of the mass
   * @param {boolean} isLabeled: determines if the mass is labeled in the view
   * @param {string} color: color of shown mass
   * @constructor
   */
  function Mass( massValue, initialPosition, isLabeled, color, tandem ) {
    var self = this;

    assert && assert( massValue > 0, 'Mass must be greater than 0' ); // To prevent divide by 0 errors
    // @public (read-only)
    this.mass = massValue;

    // @public Main model properties
    // {Property.<Vector2>}  the position of a mass is the center top of the model object.
    this.positionProperty = new Property( initialPosition, {
      // tandem: tandem.createTandem( 'positionProperty' ),
      // phetioValueType: TVector2()
    } );

    // @public {Property.<boolean>} indicates whether this mass is currently user controlled
    this.userControlledProperty = new Property( false, {
      tandem: tandem.createTandem( 'userControlledProperty' ),
      phetioValueType: TBoolean
    } );

    // @public {Property.<number>} vertical velocity of mass
    this.verticalVelocityProperty = new Property( 0, {
      tandem: tandem.createTandem( 'verticalVelocityProperty' ),
      phetioValueType: TNumber( {
        units: 'meters',
        range: new RangeWithValue( 0, Number.POSITIVE_INFINITY, 0 )
      } )
    } );

    // @public {Property.<Spring>} {Spring|null} is the mass attached to a Spring?
    this.springProperty = new Property( null, {
      // tandem: tandem.createTandem( 'positionProperty' ),
      // phetioValueType: Spring
    } );

    // TODO: Remove these statements. They are relevant for moving away from PropertyCall (https://github.com/phetsims/masses-and-springs/issues/18)
    Property.preventGetSet( this, 'position' );
    Property.preventGetSet( this, 'userControlled' );
    Property.preventGetSet( this, 'verticalVelocity' );
    Property.preventGetSet( this, 'spring' );


    // @public {read-only} Non property model attributes
    this.isLabeled = isLabeled;
    this.color = color;
    this.hookHeight = .03; // height in m
    this.radius = Math.pow( this.mass / (DENSITY * HEIGHT_RATIO * Math.PI ), 1 / 3 );
    this.cylinderHeight = this.radius * HEIGHT_RATIO;
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
     * @public
     *
     * @param {number} gravity
     * @param {number} floorY
     * @param {number} dt
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
     * @public
     *
     * @param {Spring} spring
     */
    attach: function( spring ) {
      this.verticalVelocityProperty.set( 0 );
      this.springProperty.set( spring );
    },

    /**
     * @public
     */
    detach: function() {
      this.verticalVelocityProperty.set( 0 );
      this.springProperty.set( null );
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

} );