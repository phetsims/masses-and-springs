// Copyright 2016-2017, University of Colorado Boulder

/**
 * Node responsible for representing the mass object.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Line = require( 'SCENERY/nodes/Line' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  // var ArrowNodeCreator = require( 'MASSES_AND_SPRINGS/common/util/ArrowNodeCreator' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var TandemSimpleDragHandler = require( 'TANDEM/scenery/input/TandemSimpleDragHandler' );
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var massValueString = require( 'string!MASSES_AND_SPRINGS/massValue' );

  // constants
  var ARROW_SIZE_DEFAULT = 25;
  var FORCES = 'forces'; // TODO: if used in multiple files, factor out to MassesAndSpringsConstants
  var NET_FORCE = 'netForce'; // TODO: if used in multiple files, factor out to MassesAndSpringsConstants

  /**
   * @param {Mass} mass:  model object
   * @param {boolean} showVectors
   * @param {ModelViewTransform2} modelViewTransform2
   * @param {MassesAndSpringsScreenView} screenView
   * @param {MassesAndSpringsModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function MassNode( mass, showVectors, modelViewTransform2, screenView, model, tandem ) {
    Node.call( this, { cursor: 'pointer' } );
    var self = this;

    this.mass = mass;

    var viewBounds = new Bounds2(
      modelViewTransform2.modelToViewDeltaX( -mass.radius ),
      0,
      modelViewTransform2.modelToViewDeltaX( mass.radius ),
      modelViewTransform2.modelToViewDeltaY( -mass.height )
    );
    var rect = Rectangle.bounds( viewBounds, {
      stroke: 'black',
      lineWidth: .5,
      fill: new LinearGradient( viewBounds.minX, 0, viewBounds.maxX, 0 )
        .addColorStop( 0.1, mass.color )
        .addColorStop( 0.2, 'rgb(205, 206, 207)' )
        .addColorStop( .7, mass.color )
    } );

    this.addChild( rect );
    if ( mass.isLabeled ) {
      var label = new Text( StringUtils.format( massValueString, mass.mass * 1000 ), {
        font: MassesAndSpringsConstants.TITLE_FONT,
        fill: 'black',
        centerY: viewBounds.centerY,
        centerX: 0,
        pickable: false,
        maxWidth: 50,
        tandem: tandem.createTandem( 'label' )
      } );

      var labelBackground = Rectangle.bounds( label.bounds, { fill: '#D3D3D3' } );
      this.addChild( labelBackground );
      this.addChild( label );

      this.mass.massProperty.link( function( massValue ) {
        if ( model.masses.adjustableMass ) {
          massValue = ( massValue / 1000 );
          label.setText( StringUtils.format( massValueString, massValue ) );
        }

        if ( model.masses.adjustableMass && model.masses.adjustableMass.springProperty.get() ) {
          model.masses.adjustableMass.springProperty.get().animatingProperty.set( true );
        }
      } );
    }

    this.mass.positionProperty.link( function( position ) {
      self.translation = modelViewTransform2.modelToViewPosition( position );
    } );

    var modelOffset;

    this.addInputListener( new TandemSimpleDragHandler( {
      // Allow moving a finger (touch) across a node to pick it up.
      allowTouchSnag: true,
      tandem: tandem.createTandem( 'dragHandler' ),

      // Handler that moves the particle in model space.
      drag: function( event ) {
        var proposedMassPosition = modelViewTransform2
          .viewToModelPosition( screenView.globalToLocalPoint( event.pointer.point ) )
          .minus( modelOffset );
        model.adjustDraggedMassPosition( self.mass, proposedMassPosition );
      },

      start: function( event ) {
        modelOffset = modelViewTransform2
          .viewToModelPosition( screenView.globalToLocalPoint( event.pointer.point ) )
          .minus( self.mass.positionProperty.get() );
        mass.userControlledProperty.set( true );
        self.moveToFront();
      },

      end: function() {
        mass.userControlledProperty.set( false );
      }
    } ) );

    var forceNullLine = new Line( 0, 0, 0, 0, {
      stroke: 'black',
      lineWidth: 1,
      cursor: 'pointer'
    } );

    var createVectorArrow = function( color, tandemID ) {
      return new ArrowNode( 10, 0, MassesAndSpringsConstants.VECTOR_ARROW_LENGTH, 0, {
        fill: color,
        stroke: 'black',
        centerY: 0,
        tailWidth: MassesAndSpringsConstants.ARROW_TAIL_WIDTH,
        headWidth: MassesAndSpringsConstants.ARROW_HEAD_WIDTH,
        tandem: tandem.createTandem( tandemID )
      } );
    };

    var createForceArrow = function( color, tandemID ) {
      return new ArrowNode( 5, 0, MassesAndSpringsConstants.FORCES_ARROW_LENGTH, 0, {
        fill: color,
        stroke: color,
        centerY: 0,
        tailWidth: MassesAndSpringsConstants.SMALLER_ARROW_TAIL_WIDTH,
        headWidth: MassesAndSpringsConstants.SMALLER_ARROW_HEAD_WIDTH,
        tandem: tandem.createTandem( tandemID )
      } );
    };

    //Arrows created for vectors associated with mass nodes
    this.velocityArrow = createVectorArrow( MassesAndSpringsConstants.VELOCITY_ARROW_COLOR, 'velocityArrow' );
    this.accelerationArrow = createVectorArrow( MassesAndSpringsConstants.ACCELERATION_ARROW_COLOR, 'accelerationArrow' );
    this.gravityForceArrow = createForceArrow( MassesAndSpringsConstants.GRAVITY_ARROW_COLOR, 'gravityForceArrow' );
    this.springForceArrow = createForceArrow( MassesAndSpringsConstants.SPRING_ARROW_COLOR, 'springForceArrow' );
    this.netForceArrow = createForceArrow( 'black', 'netForceArrow' );

    if ( showVectors ) {
      this.addChild( this.velocityArrow );
      this.addChild( this.accelerationArrow );
      this.addChild( this.gravityForceArrow );
      this.addChild( this.springForceArrow );
      this.addChild( this.netForceArrow );
      this.addChild( forceNullLine );

      /**
       * Show/hide the velocity and acceleration arrows when appropriate
       * @param {Property.<boolean>} arrowVisibilityProperty
       * @param {Node} arrowNode
       *
       * @private
       */
      var updateArrowVisibility = function( arrowVisibilityProperty, arrowNode ) {
        Property.multilink( [ mass.springProperty, arrowVisibilityProperty, mass.userControlledProperty ],
          function( spring, vectorVisibility, userControlled ) {
            // console.log( 'updateArrow' );
            arrowNode.visible = !!spring && vectorVisibility && !userControlled;
          } );
      };

      /**
       * Show/hide the spring and gravity force vectors when appropriate
       * @param {Property.<boolean>} arrowVisibilityProperty
       * @param {Node} arrowNode
       *
       * @private
       */
      var updateForceVisiblity = function( arrowVisibilityProperty, arrowNode ) {
        Property.multilink( [ mass.springProperty, arrowVisibilityProperty, model.forcesModeProperty ],
          function( spring, springVectorVisibility, forcesMode ) {
            arrowNode.visible = !!spring && springVectorVisibility && forcesMode === FORCES;
          } );
      };

      // Show/hide the velocity arrow
      updateArrowVisibility( model.velocityVectorVisibilityProperty, self.velocityArrow );

      // Show/hide the acceleration arrow
      updateArrowVisibility( model.accelerationVectorVisibilityProperty, self.accelerationArrow );

      // Show/hide the spring force arrow
      updateForceVisiblity( model.springVectorVisibilityProperty, self.springForceArrow );

      // Show/hide the gravity force arrow
      updateForceVisiblity( model.gravityVectorVisibilityProperty, self.gravityForceArrow );

      // Show/hide the net force arrow
      Property.multilink( [ mass.springProperty, model.forcesModeProperty ],
        function( spring, forcesMode ) {
          self.netForceArrow.visible = !!spring && forcesMode === NET_FORCE;
        }
      );

      // Show/hide line at base of vectors
      Property.multilink( [ mass.springProperty, model.gravityVectorVisibilityProperty, model.springVectorVisibilityProperty, model.forcesModeProperty ],
        function( spring, gravityForceVisible, springForceVisible, forcesVisible ) {
          forceNullLine.visible = !!spring && (gravityForceVisible || springForceVisible || forcesVisible === NET_FORCE);
        } );

      //TODO: Create MASArrowNode with arguments for deltas in X&Y, mass position, and the property it is depicting
      //Links for handling the length of the vectors in response to the system.
      var scalingFactor = 3;
      Property.multilink( [ mass.verticalVelocityProperty, model.velocityVectorVisibilityProperty ], function( velocity, visible ) {
        if ( visible ) {
          var position = mass.positionProperty.get();
          self.velocityArrow.setTailAndTip(
            position.x - 10,
            position.y + 10,
            position.x - 10,
            position.y + 10 - ARROW_SIZE_DEFAULT * velocity * scalingFactor
          );
        }
      } );

      // When gravity changes, update the gravitational force arrow
      Property.multilink( [ mass.gravityProperty, model.gravityVectorVisibilityProperty ], function( gravity, visible ) {
        if ( visible ) {
          var position = mass.positionProperty.get();
          var gravitationalAcceleration = mass.mass * gravity;
          self.gravityForceArrow.setTailAndTip(
            position.x + 45,
            position.y + 40,
            position.x + 45,
            position.y + 40 + ARROW_SIZE_DEFAULT * gravitationalAcceleration
          );
        }
      } );

      // When the spring force changes, update the spring force arrow
      Property.multilink( [ mass.springForceProperty, model.springVectorVisibilityProperty ], function( springForce, visible ) {
        if ( visible ) {
          var position = mass.positionProperty.get();
          self.springForceArrow.setTailAndTip(
            position.x + 45,
            position.y + 40,
            position.x + 45,
            position.y + 40 - ARROW_SIZE_DEFAULT * springForce
          );
        }
      } );

      // When net force changes changes, update the net force arrow
      assert && assert( mass.springProperty.get() === null, 'We currently assume that the masses don\'t start attached to the springs' );
      Property.multilink( [
        mass.netForceProperty,
        model.forcesModeProperty,
        model.accelerationVectorVisibilityProperty
      ], function( netForce, forcesMode, accelerationVisible ) {
        var position = mass.positionProperty.get();
        if ( forcesMode === 'netForce' ) {
          if ( Math.abs( netForce ) > 1E-6 ) {
            self.netForceArrow.setTailAndTip(
              position.x + 45,
              position.y + 40,
              position.x + 45,
              position.y + 40 - ARROW_SIZE_DEFAULT * netForce
            );
          }
        }
        if ( accelerationVisible ) {
          var netAcceleration = netForce / mass.mass;
          if ( Math.abs( netAcceleration ) > 1E-6 ) {
            self.accelerationArrow.setTailAndTip(
              position.x + 10,
              position.y + 10,
              position.x + 10,
              position.y + 10 - ARROW_SIZE_DEFAULT * netAcceleration / scalingFactor
            );
          }
        }
      } );

// When the mass's position changes update the forces baseline marker
      mass.positionProperty.link( function( position ) {
        forceNullLine.setLine( position.x + 40, position.y + 40, position.x + 50, position.y + 40 );
      } );
    }
  }

  massesAndSprings.register( 'MassNode', MassNode );
  return inherit( Node, MassNode );
} )
;