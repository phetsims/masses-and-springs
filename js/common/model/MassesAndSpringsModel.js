// Copyright 2016-2017, University of Colorado Boulder

/**
 * Common model (base type) for Masses and Springs
 *
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

  // constants
  var GRABBING_DISTANCE = .1; // {number} horizontal distance from a mass where a spring will be snagged
  var DROPPING_DISTANCE = .1; // {number} horizontal distance from a mass where a spring will be released
  var DEFAULT_SPRING_LENGTH = .5; // {number} default length of spring on sim start up

  // phet-io modules
  var TBoolean = require( 'ifphetio!PHET_IO/types/TBoolean' );
  var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );
  var TString = require( 'ifphetio!PHET_IO/types/TString' );

  /**
   * TODO:: document all properties and items set on objects (entire sim)
   * TODO:: .somethingProperty.get() should just be .something or .somethingProperty.value
   * TODO:: There has to be a better way to manage all of these properties as one entity (ask JB)
   * @constructor
   */
  function MassesAndSpringsModel( tandem ) {
    var self = this;

    // @public {Property.<boolean>} determines whether the sim is in a play/pause state
    this.playingProperty = new Property( true, {
      tandem: tandem.createTandem( 'playingProperty' ),
      phetioValueType: TBoolean
    } );

    // @public {Property.<number>} c - coefficient of friction
    // TODO: Once range is decided for frictionProperty, pass in as range property for TNumber()
    this.frictionProperty = new Property( .2, {
      tandem: tandem.createTandem( 'frictionProperty' ),
      phetioValueType: TNumber()
    } );

    // @public {Property.<number>} a - gravitational acceleration (positive)
    this.gravityProperty = new Property( Body.EARTH.gravity, {
      tandem: tandem.createTandem( 'gravityProperty' ),
      phetioValueType: TNumber( {
        units: 'meters/second/second',
        range: new RangeWithValue( 0, 30, Body.EARTH.gravity )
      } )
    } );

    // @public {Property.<string>} determines the speed at which the sim plays
    this.simSpeedProperty = new Property( 'normal', {
      tandem: tandem.createTandem( 'simSpeedProperty' ),
      phetioValueType: TString
    } );

    // @public {Property.<string>} valid values are "same-length" and "adjustable-length"
    this.springLengthModeProperty = new Property( 'same-length', {
      tandem: tandem.createTandem( 'springLengthModeProperty' ),
      phetioValueType: TString
    } );

    // @public {Property.<boolean>} determines visibility of ruler node
    this.rulerVisibleProperty = new Property( false, {
      tandem: tandem.createTandem( 'rulerVisibleProperty' ),
      phetioValueType: TBoolean
    } );

    // @public {Property.<string || null>} valid values are 'spring-constant', 'spring-thickness', and null
    this.selectedConstantProperty = new Property( null, {
      tandem: tandem.createTandem( 'selectedConstantProperty' ),
      phetioValueType: TString
    } );

    // @public {Property.<boolean>} determines visibility of timer node
    this.timerVisibleProperty = new Property( false, {
      tandem: tandem.createTandem( 'timerVisibleProperty' ),
      phetioValueType: TBoolean
    } );

    // @public {Property.<number>} value attributed to seconds in timer node
    this.timerSecondProperty = new Property( 0, {
      tandem: tandem.createTandem( 'timerSecondProperty' ),
      phetioValueType: TNumber( { units: 'seconds', range: new RangeWithValue( 0, Number.POSITIVE_INFINITY, 0 ) } )
    } );

    // @public {Property.<boolean>} determines whether timer is active or not
    this.timerRunningProperty = new Property( false, {
      tandem: tandem.createTandem( 'timerRunningPropertyProperty' ),
      phetioValueType: TBoolean
    } );

    // @public {Property.<boolean>} determines visibility of movable line node
    this.movableLineVisibleProperty = new Property( true, {
      tandem: tandem.createTandem( 'movableLineVisibleProperty' ),
      phetioValueType: TBoolean
    } );

    // @public {Property.<boolean>} determines visibility of equilibrium line node
    this.equilibriumPositionVisibleProperty = new Property( true, {
      tandem: tandem.createTandem( 'equilibriumPositionVisibleProperty' ),
      phetioValueType: TBoolean
    } );

    // @public {Property.<boolean>} determines visibility of natural length line node
    this.naturalLengthVisibleProperty = new Property( false, {
      tandem: tandem.createTandem( 'naturalLengthVisibleProperty' ),
      phetioValueType: TBoolean
    } );

    //body: Body.EARTH, //TODO:: use a default body instead of a default gravity

    // TODO: Remove these statements. They are relevant for moving away from PropertyCall (https://github.com/phetsims/masses-and-springs/issues/18)
    Property.preventGetSet( this, 'playing' );
    Property.preventGetSet( this, 'friction' );
    Property.preventGetSet( this, 'gravity' );
    Property.preventGetSet( this, 'rulerVisible' );
    Property.preventGetSet( this, 'selectedConstant' );
    Property.preventGetSet( this, 'springLengthView' );
    Property.preventGetSet( this, 'initialAdjustableSpringNaturalLength' );
    Property.preventGetSet( this, 'timerVisible' );
    Property.preventGetSet( this, 'timerSecond' );
    Property.preventGetSet( this, 'timerRunning' );
    Property.preventGetSet( this, 'naturalLengthVisible' );
    Property.preventGetSet( this, 'movableLineVisible' );
    Property.preventGetSet( this, 'equilibriumPositionVisible' );

    this.floorY = 0; // @public {read-only} Y position of floor in m
    this.ceilingY = 1.23; // @public {read-only} Y position of ceiling in m

    // @public {read-only} Springs created to be used in the icons for the scene selection tabs
    this.springsIcon = [
      new Spring( new Vector2( .65, this.ceilingY ), DEFAULT_SPRING_LENGTH, new RangeWithValue( 5, 15, 9 ), 0, tandem.createTandem( 'firstIconSpring' ) ),
      new Spring( new Vector2( .85, this.ceilingY ), DEFAULT_SPRING_LENGTH, new RangeWithValue( 5, 15, 9 ), 0, tandem.createTandem( 'secondIconSpring' ) ),
      new Spring( new Vector2( .65, this.ceilingY + .17 ), DEFAULT_SPRING_LENGTH, new RangeWithValue( 5, 15, 9 ), 0, tandem.createTandem( 'thirdIconSpring' ) )
    ];

    // @public model of springs used throughout the sim
    this.springs = [
      new Spring( new Vector2( .65, this.ceilingY ), DEFAULT_SPRING_LENGTH, new RangeWithValue( 5, 15, 9 ), this.frictionProperty.get(), tandem.createTandem( 'leftSpring' ) ),
      new Spring( new Vector2( .95, this.ceilingY ), DEFAULT_SPRING_LENGTH, new RangeWithValue( 5, 15, 9 ), this.frictionProperty.get(), tandem.createTandem( 'rightSpring' ) )
    ];

    // @public responsible for changing the default length
    this.springLengthModeProperty.link( function( mode ) {
      if ( mode === 'same-length' ) {
        self.springs[ 0 ].naturalRestingLengthProperty.set( DEFAULT_SPRING_LENGTH );
      }
      else if ( mode === 'adjustable-length' ) {
        // @private {read-only} initial length of adjustable spring on second scene
        var initialAdjustableSpringNaturalLengthProperty = DEFAULT_SPRING_LENGTH / 2;
        self.springs[ 0 ].naturalRestingLengthProperty.set( initialAdjustableSpringNaturalLengthProperty );
      }
    } );

    this.masses = [
      new Mass( .250, new Vector2( .12, .5 ), true, 'grey', tandem.createTandem( 'largeGreyMass' ) ),
      new Mass( .100, new Vector2( .20, .5 ), true, 'grey', tandem.createTandem( 'mediumGreyMass1' ) ),
      new Mass( .100, new Vector2( .28, .5 ), true, 'grey', tandem.createTandem( 'mediumGreyMass2' ) ),
      new Mass( .050, new Vector2( .33, .5 ), true, 'grey', tandem.createTandem( 'smallGreyMass' ) ),
      new Mass( .200, new Vector2( .63, .5 ), false, 'blue', tandem.createTandem( 'blueMass' ) ),
      new Mass( .150, new Vector2( .56, .5 ), false, 'green', tandem.createTandem( 'greenMass' ) ),
      new Mass( .075, new Vector2( .49, .5 ), false, 'red', tandem.createTandem( 'redMass' ) )
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
      this.frictionProperty.reset();
      this.gravityProperty.reset();
      this.playingProperty.reset();
      this.simSpeedProperty.reset();
      this.rulerVisibleProperty.reset();
      this.selectedConstantProperty.reset();
      this.springLengthModeProperty.reset();
      this.timerVisibleProperty.reset();
      this.timerSecondProperty.reset();
      this.timerRunningProperty.reset();
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
      var spring = this.springs[ springNumber ];
      var mass = spring.massProperty.get();

      // check if mass attached on spring
      if ( mass ) {
        // for readability
        // set displacement and stop further animation
        spring.displacementProperty.set( -spring.springExtension );
        spring.animatingProperty.reset();

        // place that mass at the correct location as well
        mass.positionProperty.set( new Vector2( spring.positionProperty.get().x, spring.bottomProperty.get() ) );
      }
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

        if ( this.timerRunningProperty.get() ) {
          this.timerSecondProperty.set( this.timerSecondProperty.get() + dt );
        }

        // Oscillate springs
        this.springs.forEach( function( spring ) {
          spring.oscillate( dt );
        } );
      }
    }
  } );
} );