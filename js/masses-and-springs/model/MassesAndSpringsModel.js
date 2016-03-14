// Copyright 2016, University of Colorado Boulder

/**
 * @author Matt Pennington (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Range = require( 'DOT/Range' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var Spring = require( 'MASSES_AND_SPRINGS/masses-and-springs/model/Spring' );
  var Mass = require( 'MASSES_AND_SPRINGS/masses-and-springs/model/Mass' );
  var Body = require( 'MASSES_AND_SPRINGS/masses-and-springs/model/Body' );
  var Vector2 = require( 'DOT/Vector2' );

  var GRABBING_DISTANCE = .1; // {number} horizontal distance from a mass where a spring will be snagged
  var DROPPING_DISTANCE = .1; // {number} horizontal distance from a mass where a spring will be released

  /**
   * TODO:: document all properties and items set on objects (entire sim)
   * TODO:: .somethingProperty.get() should just be .something or .somethingProperty.value
   * @constructor
   */
  function MassesAndSpringsModel() {
    var self = this;

    PropertySet.call( this, {
      timeRate: 1.0,// {number} r - rate of time passed.  r < 0 is reverse, 0 < r < 1 is slow motion, r > 1 is fast forward.
      friction: 0.1, // {number} c - coefficient of friction
      gravity: 9.8 // {number} a - gravitational acceleration (positive)
      //body: Body.EARTH, //TODO Implement this
    } );

    this.floorY = 0; // Y position of floor in m
    this.ceilingY = 1.2; // Y position of ceiling in m
    this.springs = [
      new Spring( new Vector2( .50, this.ceilingY ), .50, new Range( 0.1, 5, 1 ) ),
      new Spring( new Vector2( .80, this.ceilingY ), .50, new Range( 0.1, 5, 1 ) )
    ];
    this.masses = [
      new Mass( .250, new Vector2( .25, .5 ) ),
      new Mass( .100, new Vector2( .35, .5 ) ),
      new Mass( .050, new Vector2( .45, .5 ) ),
      new Mass( .150, new Vector2( .775, .5 ) ),
      new Mass( .075, new Vector2( .9, .5 ) ),
      new Mass( .200, new Vector2( 1.025, .5 ) )
    ];
    this.bodies = [
      Body.MOON,
      Body.EARTH,
      Body.JUPITER,
      Body.PLANET_X,
      Body.ZERO_G,
      Body.CUSTOM
    ];
    this.gravityRange = new Range( 0, 30, 9.8 );

    this.gravityProperty.link( function( newGravity ) {
      assert && assert( newGravity > 0, 'gravity must be positive : ' + newGravity );
      self.springs.forEach( function( spring ) {
        spring.gravity = newGravity;
      } );
    } );

    this.frictionProperty.link( function( newFriction ) {
      assert && assert( newFriction >= 0, 'friction must be greater than or equal to 0: ' + newFriction );
      self.springs.forEach( function( spring ) {
        spring.dampingCoefficient = newFriction;
      } );
    } );

  }

  massesAndSprings.register( 'MassesAndSpringsModel', MassesAndSpringsModel );

  return inherit( PropertySet, MassesAndSpringsModel, {

    /**
     * @override
     * @public
     */
    reset: function() {
      PropertySet.prototype.reset.call( this );
      this.masses.forEach( function( mass ) { mass.reset(); } );
      this.springs.forEach( function( system ) { system.reset(); } );
    },


    /**
     *  Based on new dragged position of mass, try to attach or detach mass if eligible and then update position.
     *
     * @public
     *
     * @param {Mass} mass
     * @param {Vector2} proposedPosition
     */
    adjustDraggedMassPosition: function( mass, proposedPosition ){
      // Attempt to detach
      if ( mass.spring && Math.abs( proposedPosition.x - mass.position.x ) > DROPPING_DISTANCE ) {
        mass.spring.removeMass();
      }
      // Update mass position and spring length if attached
      if ( mass.spring ) {
        mass.spring.displacement =  - ( mass.spring.position.y - mass.spring.naturalRestingLength ) + proposedPosition.y;
        mass.position = new Vector2( mass.spring.position.x, proposedPosition.y );
      }
      // Update mass position if unattached
      else {

        //Attempt to attach
        for ( var i in this.springs ) {
          var spring = this.springs[ i ];
          if ( Math.abs( proposedPosition.x - spring.position.x ) < GRABBING_DISTANCE &&
               Math.abs( proposedPosition.y - spring.bottomProperty.get() ) < GRABBING_DISTANCE ) {
            spring.addMass( mass );
          }
        }
        //Update position
        mass.position = proposedPosition;
      }
    },

    /**
     * @public
     *
     * @param {number} dt
     */
    step: function( dt ) {
      for ( var i in this.masses ) {
        var mass = this.masses[ i ];

        // Fall if not hung or grabbed
        if ( mass.spring === null && !mass.userControlled ) {
          mass.fallWithGravity( this.gravity, this.floorY, dt );
        }
      }

      // Oscillate springs
      for ( i in this.springs ) {
        this.springs[ i ].oscillate( dt );
      }
    }
  } );
} );