// Copyright 2016, University of Colorado Boulder

/**
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var Spring = require( 'MASSES_AND_SPRINGS/common/model/Spring' );
  var Mass = require( 'MASSES_AND_SPRINGS/common/model/Mass' );
  var Body = require( 'MASSES_AND_SPRINGS/common/model/Body' );
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

    this.playingProperty = new Property( true ); // {boolean} determines whether the sim is in a play/pause state
    this.timeRateProperty = new Property( 1.0 ); // {number} r - rate of time passed.  r < 0 is reverse, 0 < r < 1 is slow motion, r > 1 is fast forward.
    this.frictionProperty = new Property( .2 ); // {number} c - coefficient of friction
    this.gravityProperty = new Property( 9.8 ); // {number} a - gravitational acceleration (positive)
    this.simSpeedProperty = new Property( 'normal' ); // {string} determines the speed at which the sim plays
    this.rulerVisibleProperty = new Property( false );
    this.rulerIconVisibleProperty = new Property( false );
    this.timerVisibleProperty = new Property( false );
    this.movableLineVisibleProperty = new Property( true );
    this.equilibriumPositionVisibleProperty = new Property( true );
    this.naturalLengthVisibleProperty = new Property( false );

    //body: Body.EARTH, //TODO:: use a default body instead of a default gravity

    // TODO: Remove these statements. They are relevant for moving away from PropertyCall (https://github.com/phetsims/masses-and-springs/issues/18)
    Property.preventGetSet( this, 'playing' );
    Property.preventGetSet( this, 'timeRate' );
    Property.preventGetSet( this, 'friction' );
    Property.preventGetSet( this, 'gravity' );
    Property.preventGetSet( this, 'rulerVisible' );
    Property.preventGetSet( this, 'rulerIconVisible' );
    Property.preventGetSet( this, 'timerVisible' );
    Property.preventGetSet( this, 'naturalLengthVisible' );
    Property.preventGetSet( this, 'movableLineVisible' );
    Property.preventGetSet( this, 'equilibriumPositionVisible' );

    this.floorY = 0; // Y position of floor in m
    this.ceilingY = 1.23; // Y position of ceiling in m
    this.springs = [
      new Spring( new Vector2( .65, this.ceilingY ), .50, new RangeWithValue( 5, 15, 9 ), this.frictionProperty.get() ),
      new Spring( new Vector2( .95, this.ceilingY ), .50, new RangeWithValue( 5, 15, 9 ), this.frictionProperty.get() )
    ];

    this.masses = [
      new Mass( .250, new Vector2( .12, .5 ), true, 'grey' ),
      new Mass( .100, new Vector2( .20, .5 ), true, 'grey' ),
      new Mass( .100, new Vector2( .28, .5 ), true, 'grey' ),
      new Mass( .050, new Vector2( .33, .5 ), true, 'grey' ),
      new Mass( .200, new Vector2( .63, .5 ), false, 'blue' ),
      new Mass( .150, new Vector2( .56, .5 ), false, 'green' ),
      new Mass( .075, new Vector2( .49, .5 ), false, 'red' )
    ];
    this.bodies = [
      Body.MOON,
      Body.EARTH,
      Body.JUPITER,
      Body.PLANET_X,
      Body.ZERO_G,
      Body.CUSTOM
    ];
    this.gravityRange = new RangeWithValue( 0, 30, 9.8 );

    this.gravityProperty.link( function( newGravity ) {
      assert && assert( newGravity >= 0, 'gravity must be 0 or positive : ' + newGravity );
      self.springs.forEach( function( spring ) {
        spring.gravityProperty.set( newGravity );
      } );
    } );

    this.frictionProperty.link( function( newFriction ) {
      assert && assert( newFriction >= 0, 'friction must be greater than or equal to 0: ' + newFriction );
      self.springs.forEach( function( spring ) {
        spring.dampingCoefficientProperty.set( newFriction );
      } );
    } );

  }

  massesAndSprings.register( 'MassesAndSpringsModel', MassesAndSpringsModel );

  return inherit( Object, MassesAndSpringsModel, {

    /**
     * @override
     * @public
     */
    reset: function() {
      this.timeRateProperty.reset();
      this.frictionProperty.reset();
      this.gravityProperty.reset();
      this.playingProperty.reset();
      this.simSpeedProperty.reset();
      this.rulerVisibleProperty.reset();
      this.rulerIconVisibleProperty.reset();
      this.timerVisibleProperty.reset();
      this.movableLineVisibleProperty.reset();
      this.naturalLengthVisibleProperty.reset();
      this.equilibriumPositionVisibleProperty.reset();
      this.masses.forEach( function( mass ) { mass.reset(); } );
      this.springs.forEach( function( spring ) { spring.reset(); } );
    },

    /**
     *  Based on new dragged position of mass, try to attach or detach mass if eligible and then update position.
     *
     * @public
     *
     * @param {Mass} mass
     * @param {Vector2} proposedPosition
     */
    adjustDraggedMassPosition: function( mass, proposedPosition ) {
      // Attempt to detach
      if ( mass.springProperty.get() && Math.abs( proposedPosition.x - mass.positionProperty.get().x ) > DROPPING_DISTANCE ) {
        mass.springProperty.get().removeMass();
        mass.detach();
      }
      // Update mass position and spring length if attached
      if ( mass.springProperty.get() ) {
        mass.springProperty.get().displacementProperty.set( -( mass.springProperty.get().positionProperty.get().y -
                                                               mass.springProperty.get().naturalRestingLengthProperty.get() ) + proposedPosition.y );
        mass.positionProperty.set( new Vector2( mass.springProperty.get().positionProperty.get().x, proposedPosition.y ) );
        //console.log( 'snagged' );
      }
      // Update mass position if unattached
      else {
        //Attempt to attach
        this.springs.forEach( function( spring ) {
          if ( Math.abs( proposedPosition.x - spring.positionProperty.get().x ) < GRABBING_DISTANCE &&
               Math.abs( proposedPosition.y - spring.bottomProperty.get() ) < GRABBING_DISTANCE &&
               spring.massProperty.get() === null ) {
            spring.addMass( mass );
          }
        } );
        //Update position
        mass.positionProperty.set( proposedPosition );
      }
    },

    /**
     * Stop spring motion by setting the displacement to the spring's extension, which is the length from the natural
     * resting position. This will also stop the spring from further oscillation.
     * @public
     *
     * @param {number} springNumber: Determines which spring will be affected.
     */
    stopSpring: function( springNumber ) {

      // for readability
      var spring = this.springs[ springNumber ];
      var mass = spring.massProperty.get();

      // set displacement and stop further animation
      spring.displacementProperty.set( -spring.springExtension );
      spring.animatingProperty.reset();

      // place that mass at the correct location as well
      mass.positionProperty.set( new Vector2( spring.positionProperty.get().x, spring.bottomProperty.get() ) );
    },

    /**
     * @public
     */
    stepForward: function() {
      this.playingProperty.set( true );
      this.step( 1 / 60 );// steps the nominal amount used by step forward button listener
      this.playingProperty.set( false );
    },

    /**
     * @public
     *
     * @param {number} dt
     */
    step: function( dt ) {
      var self = this;

      // If simulationTimeStep is excessively large, ignore it - it probably means the user returned to the tab after
      // the tab or the browser was hidden for a while.
      if ( dt > 1.0 ) {
        return;
      }

      if ( this.playingProperty.get() ) {

        // Using real world time for this results in the atoms moving a little slowly, so the time step is adjusted
        // here.  The multipliers were empirically determined.

        switch( this.simSpeedProperty.get() ) {
          case 'normal':
            break;
          case 'slow':
            dt = dt / 8;
            break;
          default:
            assert( false, 'invalid setting for model speed' );
        }
      }

      if ( self.playingProperty.get() === true ) {
        this.masses.forEach( function( mass ) {
          // Fall if not hung or grabbed
          if ( mass.springProperty.get() === null && !mass.userControlledProperty.get() ) {
            mass.fallWithGravity( self.gravityProperty.get(), self.floorY, dt );
          }
        } );

        // Oscillate springs
        this.springs.forEach( function( spring ) {
          spring.oscillate( dt );
        } );
      }
    }
  } );
} );