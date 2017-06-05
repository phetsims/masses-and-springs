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
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var Emitter = require( 'AXON/Emitter' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var Spring = require( 'MASSES_AND_SPRINGS/common/model/Spring' );
  var Mass = require( 'MASSES_AND_SPRINGS/common/model/Mass' );
  var Body = require( 'MASSES_AND_SPRINGS/common/model/Body' );
  var Vector2 = require( 'DOT/Vector2' );

  // phet-io modules
  var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );
  var TString = require( 'ifphetio!PHET_IO/types/TString' );

  // constants
  var GRABBING_DISTANCE = 0.1; // {number} horizontal distance in meters from a mass where a spring will be connected
  var DROPPING_DISTANCE = 0.1; // {number} horizontal distance in meters from a mass where a spring will be released
  var RIGHT_SPRING_X = 0.95; // {number} X position of the spring node in screen coordinates

  /**
   * TODO:: document all properties and items set on objects (entire sim)
   * @constructor
   */
  function MassesAndSpringsModel( tandem, options ) {
    options = _.extend( {
      springCount: 2,
      showVectors: true
    }, options );
    var self = this;

    // @public {boolean} determines whether vectors associated with massNode vectors.
    this.showVectors = options.showVectors;

    // @public {Property.<boolean>} determines whether the sim is in a play/pause state
    this.playingProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'playingProperty' )
    } );

    // @public {Property.<number>} coefficient of friction applied to the system
    this.frictionProperty = new NumberProperty( 0.2, {
      // range: null,
      tandem: tandem.createTandem( 'frictionProperty' ),
      phetioValueType: TNumber( {
        units: 'newtons',
        range: null
      } )
    } );

    // TODO: Once range is decided for frictionProperty, pass in as range property for TNumber()
    this.frictionRangeProperty = new Property( new RangeWithValue( 0, 10, 1 ) );

    // @public {Property.<number>} gravitational acceleration associated with each planet
    this.gravityProperty = new Property( Body.EARTH.gravity, {
      range: new RangeWithValue( 0, 30, Body.EARTH.gravity ),
      tandem: tandem.createTandem( 'gravityProperty' ),
      phetioValueType: TNumber( {
        units: 'meters/second/second',
        range: new RangeWithValue( 0, 30, Body.EARTH.gravity )
      } )
    } );

    // @public {Property.<number>} range of gravitational acceleration associated with each planet
    this.gravityRangeProperty = new Property( new RangeWithValue( 0, 30, 9.8 ) );

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
    this.timerSecondProperty = new NumberProperty( 0, {
      range: new RangeWithValue( 0, Number.POSITIVE_INFINITY, 0 ),
      tandem: tandem.createTandem( 'timerSecondProperty' ),
      phetioValueType: TNumber( {
        units: 'seconds',
        range: new RangeWithValue( 0, Number.POSITIVE_INFINITY, 0 )
      } )
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
    this.bodyTitleProperty = new Property( Body.EARTH.title, {
      tandem: tandem.createTandem( 'bodyTitleProperty' ),
      phetioValueType: TString
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

    // @public {read-only} Y position of floor in m. The floor is at the bottom bounds of the screen.
    this.floorY = 0;

    // @public {read-only} Y position of ceiling in m.  The ceiling is at the top of the SpringHangerNode,
    // just below the top of the dev view bounds
    this.ceilingY = 1.23;


    var createSpring = function( x, tandem ) {
      return new Spring(
        new Vector2( x, self.ceilingY ),
        MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH,
        new RangeWithValue( 5, 15, 9 ),
        self.frictionProperty.get(),
        tandem
      );
    };

    assert && assert( options.springCount === 1 || 2, 'Spring count must be one or two' );
    // @public (read-only) model of springs used throughout the sim
    if ( options.springCount === 2 ) {
      this.springs = [
        createSpring( 0.65, tandem.createTandem( 'leftSpring' ) ),
        createSpring( RIGHT_SPRING_X, tandem.createTandem( 'rightSpring' ) )
      ];
    }
    else {
      this.springs = [ createSpring( RIGHT_SPRING_X, tandem.createTandem( 'spring' ) ) ];
    }

    var createMass = function( mass, xPosition, labelVisible, color, tandem ) {
      return new Mass( mass, new Vector2( xPosition, .5 ), labelVisible, color, self.gravityProperty, tandem );
    };

    // @public (read-only) model of masses used throughout the sim
    if ( options.springCount === 2 ) {
      this.masses = {
        largeLabeledMass: createMass( .250, .12, true, 'grey', tandem.createTandem( 'largeLabeledMass' ) ),
        mediumLabeledMass1: createMass( .100, .20, true, 'grey', tandem.createTandem( 'mediumLabeledMass1' ) ),
        mediumLabeledMass2: createMass( .100, .28, true, 'grey', tandem.createTandem( 'mediumLabeledMass2' ) ),
        smallLabeledMass: createMass( .050, .33, true, 'grey', tandem.createTandem( 'smallLabeledMass' ) ),
        largeUnlabeledMass: createMass( .200, .63, false, 'blue', tandem.createTandem( 'largeUnlabeledMass' ) ),
        mediumUnlabeledMass: createMass( .150, .56, false, 'green', tandem.createTandem( 'mediumUnlabeledMass' ) ),
        smallUnlabeledMass: createMass( .075, .49, false, 'red', tandem.createTandem( 'smallUnlabeledMass' ) )
      };
    }
    else if ( options.springCount === 1 ) {
      this.masses = {
        adjustableMass: createMass( .100,
          this.springs[ 0 ].positionProperty.get().x,
          true,
          'rgb(  247, 151, 34 )',
          tandem.createTandem( 'adjustableMass' ) )
      };
    }

    // @public (read-only) model of bodies used throughout the sim
    this.bodies = [
      Body.MOON,
      Body.EARTH,
      Body.JUPITER,
      Body.PLANET_X,
      Body.ZERO_G,
      Body.CUSTOM
    ];

    // Links are used to set gravity property of each spring to the gravity property of the system
    this.gravityProperty.link( function( newGravity ) {
      assert && assert( newGravity >= 0, 'gravity must be 0 or positive : ' + newGravity );
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
    this.springs.forEach( function( spring ) {
      spring.springConstantProperty.link( function( springConstant ) {
        spring.updateThickness( spring.naturalRestingLengthProperty.get(), springConstant );
      } );
    } );

    // Triggered after pushing stopSpringButton
    this.stopSpringEmitter = new Emitter();
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
      this.bodyTitleProperty.reset();
      this.gravityRangeProperty.reset();
      this.playingProperty.reset();
      this.simSpeedProperty.reset();
      this.rulerVisibleProperty.reset();
      this.timerVisibleProperty.reset();
      this.timerSecondProperty.reset();
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
     * Based on new dragged position of mass, try to attach or detach mass if eligible and then update position.
     *
     * @param {Mass} mass
     * @param {Vector2} proposedPosition
     * @public
     */
    adjustDraggedMassPosition: function( mass, proposedPosition ) {

      // Attempt to detach
      if ( mass.springProperty.get()
           && Math.abs( proposedPosition.x - mass.positionProperty.get().x ) > DROPPING_DISTANCE ) {
        mass.springProperty.get().removeMass();
        mass.detach();
      }

      // Update mass position and spring length if attached
      if ( mass.springProperty.get() ) {
        mass.springProperty.get().displacementProperty.set(
          -(mass.springProperty.get().positionProperty.get().y -
            mass.springProperty.get().naturalRestingLengthProperty.get() ) +
          proposedPosition.y );
        mass.positionProperty.set(
          new Vector2( mass.springProperty.get().positionProperty.get().x, proposedPosition.y ) );
      }

      // Update mass position if unattached
      else {
        //Attempt to attach
        this.springs.forEach( function( spring ) {
          if ( Math.abs( proposedPosition.x - spring.positionProperty.get().x ) < GRABBING_DISTANCE &&
               Math.abs( proposedPosition.y - spring.bottomProperty.get() ) < GRABBING_DISTANCE &&
               spring.massProperty.get() === null ) {
            spring.setMass( mass );
          }
        } );

        //Update position
        mass.positionProperty.set( proposedPosition );
      }
    },

    /**
     * Stop spring motion by setting the displacement to the spring's extension, which is the length from the natural
     * resting position. This will also stop the spring from further oscillation.
     *
     * @param {number} springNumber: Determines which spring will be affected.
     * @public
     */
    stopSpring: function( springNumber ) {
      var spring = this.springs[ springNumber ];
      var mass = spring.massProperty.get();

      // check if mass attached on spring
      if ( mass ) {

        // set displacement and stop further animation
        spring.displacementProperty.set( -spring.springExtension );
        spring.animatingProperty.reset();

        // place that mass at the correct location as well
        mass.positionProperty.set( new Vector2( spring.positionProperty.get().x, spring.bottomProperty.get() ) );
        mass.verticalVelocityProperty.set( 0 );
        mass.accelerationProperty.set( 0 );
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
      if ( this.playingProperty.get() === true ) {
        _.values( this.masses ).forEach( function( mass ) {

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
          if ( spring.massProperty.get() && !spring.massProperty.get().userControlledProperty.get() &&
               spring.animatingProperty.get() ) {
            spring.stepOscillate( dt );
          }
        } );
      }
    }
  } );
} );