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
  var Body = require( 'MASSES_AND_SPRINGS/common/model/Body' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var Mass = require( 'MASSES_AND_SPRINGS/common/model/Mass' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var MassesAndSpringsQueryParameters = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsQueryParameters' );
  var OscillatingSpringNode = require( 'MASSES_AND_SPRINGS/common/view/OscillatingSpringNode' );
  var Property = require( 'AXON/Property' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var Spring = require( 'MASSES_AND_SPRINGS/common/model/Spring' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  // phet-io modules
  var TBody = require( 'MASSES_AND_SPRINGS/common/model/TBody' );
  var TString = require( 'ifphetio!PHET_IO/types/TString' );

  // constants
  var GRABBING_DISTANCE = 0.1; // {number} horizontal distance in meters from a mass where a spring will be connected
  var RELEASE_DISTANCE = 0.1; // {number} horizontal distance in meters from a mass where a spring will be released
  var RIGHT_SPRING_X = 0.975; // {number} X position of the spring node in screen coordinates

  /**
   * TODO:: document all properties and items set on objects (entire sim)
   * @constructor
   */
  function MassesAndSpringsModel( tandem, options ) {

    var self = this;

    // @public {Property.<boolean>} determines whether the sim is in a play/pause state
    this.playingProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'playingProperty' )
    } );

    this.isSoundEnabledProperty = new Property( true, {
      tandem: tandem.createTandem( 'isSoundEnabledProperty' )
    } );

    // @public {Property.<number>} coefficient of friction applied to the system
    this.frictionProperty = new Property( 0.2, {
      units: 'newtons',
      tandem: tandem.createTandem( 'frictionProperty' )
    } );

    // @public {Property.<number>} gravitational acceleration associated with each planet
    this.gravityProperty = new Property( Body.EARTH.gravity, {
      tandem: tandem.createTandem( 'gravityProperty' ),
      units: 'meters/second/second',
      range: new RangeWithValue( 0, 30, Body.EARTH.gravity )
    } );

    // @public {Property.<string>} determines the speed at which the sim plays.
    this.simSpeedProperty = new Property( 'normal', {
      tandem: tandem.createTandem( 'simSpeedProperty' ),
      phetioValueType: TString,
      validValues: [ 'slow', 'normal' ]
    } );

    // @public {Property.<boolean>} determines visibility of ruler node
    this.rulerVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'rulerVisibleProperty' )
    } );

    // @public {Property.<boolean>} determines visibility of timer node
    this.timerVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'timerVisibleProperty' )
    } );

    // @public {Property.<number>} elapsed time shown in the timer (rounded off to the nearest second)
    this.timerSecondsProperty = new Property( 0, {
      range: new RangeWithValue( 0, Number.POSITIVE_INFINITY, 0 ),
      tandem: tandem.createTandem( 'timerSecondsProperty' ),
      units: 'seconds'
    } );

    // @public {Property.<boolean>} determines whether timer is active or not
    this.timerRunningProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'timerRunningPropertyProperty' )
    } );

    // @public {Property.<boolean>} determines visibility of movable line node
    this.movableLineVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'movableLineVisibleProperty' )
    } );

    // @public {Property.<boolean>} determines visibility of equilibrium line node
    this.equilibriumPositionVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'equilibriumPositionVisibleProperty' )
    } );

    // @public {Property.<boolean>} determines visibility of natural length line node
    this.naturalLengthVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'naturalLengthVisibleProperty' )
    } );

    // @public {Property.<string>} name of planet selected
    this.bodyProperty = new Property( Body.EARTH, {
      tandem: tandem.createTandem( 'bodyProperty' ),
      phetioValueType: TBody
    } );

    // Visibility properties of vectors associated with each mass
    // @public {Property.<boolean>} determines the visibility of the velocity vector
    this.velocityVectorVisibilityProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'velocityVectorVisibilityProperty' )
    } );

    // @public {Property.<boolean>} determines the visibility of the acceleration vector
    this.accelerationVectorVisibilityProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'accelerationVectorVisibilityProperty' )
    } );

    // @public {Property.<boolean>} determines the visibility of the gravitational force vector
    this.gravityVectorVisibilityProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'gravityVectorVisibilityProperty' )
    } );

    // @public {Property.<boolean>} determines the visibility of the spring force vector
    this.springVectorVisibilityProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'springVectorVisibilityProperty' )
    } );

    // @public {Property.<string>} determines mode of the vectors to be viewed
    this.forcesModeProperty = new Property( MassesAndSpringsConstants.FORCES_STRING, {
      tandem: tandem.createTandem( 'forcesModeProperty' ),
      phetioValueType: TString,
      validValues: [ MassesAndSpringsConstants.FORCES_STRING, MassesAndSpringsConstants.NET_FORCE_STRING ]
    } );

    var createSpring = function( x, tandem ) {
      return new Spring(
        new Vector2( x, MassesAndSpringsConstants.CEILING_Y ),
        MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH,
        self.frictionProperty.get(),
        tandem
      );
    };

    // Array that will contain all of the springs.
    this.springs = [];

    // Spring set that contains two springs. Used on the Intro and Vector screens.
    this.defaultSpringSet = [
      createSpring( RIGHT_SPRING_X - 0.25, tandem.createTandem( 'leftSpring' ) ),
      createSpring( RIGHT_SPRING_X, tandem.createTandem( 'rightSpring' ) )
    ];

    // Spring set that contains one spring. Used on the Energy and Lab screens.
    this.oneSpringSet = [ createSpring( RIGHT_SPRING_X - .01, tandem.createTandem( 'spring' ) ) ];

    // Here we set our common model springs to represent the default set of two springs.
    this.springs = this.defaultSpringSet;

    // Array that will contain all of the masses.
    this.masses = [];

    // Positional reference to the first spring, that is used to position the masses.
    var massXCoordinate = this.springs[ 0 ].positionProperty.get().x;

    // Mass set that contains seven standard masses. Used on the Intro and Vector screens.
    this.defaultMasses = [
      this.createMass( 0.250, 0.12, true, 'grey', null, tandem.createTandem( 'largeLabeledMass' ) ),
      this.createMass( 0.100, 0.20, true, 'grey', null, tandem.createTandem( 'mediumLabeledMass1' ) ),
      this.createMass( 0.100, 0.28, true, 'grey', null, tandem.createTandem( 'mediumLabeledMass2' ) ),
      this.createMass( 0.050, 0.33, true, 'grey', null, tandem.createTandem( 'smallLabeledMass' ) ),
      this.createMass( 0.200, 0.63, false, 'blue', null, tandem.createTandem( 'largeUnlabeledMass' ) ),
      this.createMass( 0.150, 0.56, false, 'green', null, tandem.createTandem( 'mediumUnlabeledMass' ) ),
      this.createMass( 0.075, 0.49, false, 'red', null, tandem.createTandem( 'smallUnlabeledMass' ) )
    ];

    // Mass set containing one adjustable mass that is used on the energy screen.
    this.energyScreenMasses = [
      this.createMass( 0.100, massXCoordinate - 0.10, true, 'rgb(  247, 151, 34 )', null, tandem.createTandem( 'adjustableMass' ) )
    ];
    this.energyScreenMasses[ 0 ].adjustable = true;

    // Mass set containing three masses for use on the lab screen.
    this.labScreenMasses = [
      this.createMass( 0.100, massXCoordinate - 0.20, true, 'rgb(  247, 151, 34 )', null, tandem.createTandem( 'adjustableMass' ) ),
      this.createMass( 0.125, massXCoordinate - 0.10, true, 'red', null, tandem.createTandem( 'redLabeledMass' ) ),
      this.createMass( 0.150, massXCoordinate, true, 'green', null, tandem.createTandem( 'greenLabeledMass' ) )
    ];
    this.labScreenMasses[ 0 ].adjustable = true;
    this.labScreenMasses[ 1 ].options.mysteryLabel = true;
    this.labScreenMasses[ 2 ].options.mysteryLabel = true;

    // Here we set our common model masses to represent the default set of seven standard masses.
    this.masses = this.defaultMasses;

    // @public (read-only) model of bodies used throughout the sim
    // Links are used to set gravity property of each spring to the gravity property of the system
    this.gravityProperty.link( function( newGravity ) {
      self.springs.forEach( function( spring ) {
        spring.gravityProperty.set( newGravity );
      } );
    } );

    // Links are used to set friction property of each spring to the friction property of the system
    this.frictionProperty.link( function( newFriction ) {
      assert && assert( newFriction >= 0, 'friction must be greater than or equal to 0: ' + newFriction );
      self.springs.forEach( function( spring ) {
        spring.dampingCoefficientProperty.set( newFriction );
      } );
    } );

    // Used for testing purposes
    if ( MassesAndSpringsQueryParameters.printSpringProperties ) {
      Property.multilink( [ self.springs[ 0 ].springConstantProperty, self.springs[ 0 ].thicknessProperty ], function( springConstant, springThickness ) {

        console.log( 'springConstant = ' + Util.toFixed( springConstant, 3 ) + '\t\t' + 'thickness = ' + Util.toFixed( springThickness, 3 ) );
      } );
    }
  }

  massesAndSprings.register( 'MassesAndSpringsModel', MassesAndSpringsModel );

  return inherit( Object, MassesAndSpringsModel, {

    /**
     * @override
     *
     * @public
     */
    reset: function() {
      this.frictionProperty.reset();
      this.gravityProperty.reset();
      this.bodyProperty.reset();
      this.playingProperty.reset();
      this.simSpeedProperty.reset();
      this.rulerVisibleProperty.reset();
      this.timerVisibleProperty.reset();
      this.timerSecondsProperty.reset();
      this.timerRunningProperty.reset();
      this.movableLineVisibleProperty.reset();
      this.naturalLengthVisibleProperty.reset();
      this.equilibriumPositionVisibleProperty.reset();
      this.velocityVectorVisibilityProperty.reset();
      this.accelerationVectorVisibilityProperty.reset();
      this.gravityVectorVisibilityProperty.reset();
      this.springVectorVisibilityProperty.reset();
      this.forcesModeProperty.reset();
      for ( var referencedMass in this.masses ) {
        if ( !this.masses.hasOwnProperty( referencedMass ) ) {
          continue;
        }
        var mass = this.masses[ referencedMass ];
        mass.reset();
      }
      this.springs.forEach( function( spring ) { spring.reset(); } );
    },

    /**
     * Creates new mass object and pushes it into the model's mass array.
     *
     * @param {number} mass - mass in kg
     * @param {number} xPosition - starting x-coordinate of the mass object
     * @param {boolean} labelVisible - should a label be shown on the MassNode
     * @param {string} color - color of the MassNode
     * @param {string} specifiedLabel - customized label for the MassNode
     * @param {Tandem} tandem
     *
     * @protected
     * @returns {*}
     */
    createMass: function( mass, xPosition, labelVisible, color, specifiedLabel, tandem ) {
      return new Mass( mass, new Vector2( xPosition, 0.5 ), labelVisible, color, this.gravityProperty, tandem );
    },

    /**
     * Based on new dragged position of mass, try to attach or detach mass if eligible and then update position.
     *
     * @param {Mass} mass
     * @param {Bounds2} visibleBounds - visible bounds of the sim screen
     * @public
     */
    adjustDraggedMassPosition: function( mass, visibleBounds ) {
      var massPosition = mass.positionProperty.get();

      // Attempt to detach
      if ( mass.springProperty.get()
           && Math.abs( mass.springProperty.get().positionProperty.get().x - massPosition.x ) > RELEASE_DISTANCE ) {
        mass.springProperty.get().removeMass();
        mass.detach();
      }

      // Update mass position and spring length if attached
      if ( mass.springProperty.get() ) {

        // Update the position of the mass
        if ( mass.positionProperty.value.x !== mass.springProperty.get().positionProperty.get().x ) {
          mass.positionProperty.set( mass.positionProperty.get().copy().setX( mass.springProperty.get().positionProperty.get().x ) );
        }

        // Update spring length
        mass.springProperty.get().displacementProperty.set(
          -(mass.springProperty.get().positionProperty.get().y -
            mass.springProperty.get().naturalRestingLengthProperty.get() ) +
          massPosition.y );

        // Maximum y value the spring should be able to contract based on the thickness and amount of spring coils.
        var maxY = mass.springProperty.get().thicknessProperty.get() *
                   OscillatingSpringNode.MAP_NUMBER_OF_LOOPS( mass.springProperty.get().naturalRestingLengthProperty.get() );

        // Constraints used to limit how much we can prime the spring's oscillation.
        var upperConstraint = new LinearFunction( 20, 60, 1.112, 1.006 );

        // Max Y value in model coordinates
        var modelMaxY = upperConstraint( maxY );

        // Update only the spring's length if we are lower than the max Y
        if ( mass.positionProperty.get().y > modelMaxY ) {

          // set mass position to maximum y position based on spring coils
          mass.positionProperty.set( mass.positionProperty.get().copy().setY( modelMaxY ) );

          // Limit the length of the spring to based on the spring coils.
          mass.springProperty.get().displacementProperty.set(
            -(mass.springProperty.get().positionProperty.get().y -
              mass.springProperty.get().naturalRestingLengthProperty.get() ) +
            modelMaxY );
        }
      }

      // Update mass position if unattached
      else {

        //Attempt to attach
        this.springs.forEach( function( spring ) {
          if ( Math.abs( massPosition.x - spring.positionProperty.get().x ) < GRABBING_DISTANCE &&
               Math.abs( massPosition.y - spring.bottomProperty.get() ) < GRABBING_DISTANCE &&
               spring.massAttachedProperty.get() === null ) {
            spring.setMass( mass );
          }
        } );
      }
    },

    /**
     * Responsible for stepping through sim at 1/60th speed and paused after step.
     * @public
     */
    stepForward: function() {
      this.playingProperty.set( true );
      this.step( 1 / 60 );// steps the nominal amount used by step forward button listener
      this.playingProperty.set( false );
    },

    /**
     * @param {number} dt
     * @public
     */
    step: function( dt ) {
      var self = this;

      // If simulationTimeStep > 1, ignore it - it probably means the user returned to the tab after
      // the tab or the browser was hidden for a while.
      if ( this.playingProperty.get() ) {

        // Change the dt value if we are playing in slow motion.
        switch( this.simSpeedProperty.get() ) {
          case 'normal':
            break;
          case 'slow':
            dt = dt / 8;
            break;
          default:
            assert( false, 'invalid setting for model speed' );
        }
        _.values( this.masses ).forEach( function( mass ) {

          // Fall if not hung or grabbed
          mass.step( self.gravityProperty.get(), MassesAndSpringsConstants.FLOOR_Y, dt );
        } );
        if ( this.timerRunningProperty.get() ) {
          this.timerSecondsProperty.set( this.timerSecondsProperty.get() + dt );
        }
        // Oscillate springs
        this.springs.forEach( function( spring ) {
          spring.step( dt );
        } );
      }
    }
  }, {
    BODIES: [ Body.MOON, Body.EARTH, Body.JUPITER, Body.PLANET_X, Body.ZERO_G, Body.CUSTOM ]
  } );
} );
