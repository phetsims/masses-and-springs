// Copyright 2017, University of Colorado Boulder

/**
 * Node responsible for representing the mass object.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var Color = require( 'SCENERY/util/Color' );
  var ForceVectorArrow = require( 'MASSES_AND_SPRINGS/common/view/ForceVectorArrow' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var VectorArrow = require( 'MASSES_AND_SPRINGS/common/view/VectorArrow' );

  // strings
  var massValueString = require( 'string!MASSES_AND_SPRINGS/massValue' );
  var questionMarkString = require( 'string!MASSES_AND_SPRINGS/questionMark' );

  // constants
  var ARROW_SIZE_DEFAULT = 25;

  /**
   * @param {Mass} mass - model object
   * @param {boolean} showVectors
   * @param {ModelViewTransform2} modelViewTransform2
   * @param {Bounds2} dragBounds
   * @param {MassesAndSpringsModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function MassNode( mass, showVectors, modelViewTransform2, dragBounds, model, tandem ) {
    Node.call( this, { cursor: 'pointer', pathBoundsMethod: 'none', renderer: 'canvas' } );
    var self = this;

    this.mass = mass;

    // TODO: factor out the hook from the height.
    var hookHeight = modelViewTransform2.modelToViewDeltaY( -mass.hookHeightProperty.get() );

    var rectOptions = {
      stroke: 'black',
      lineWidth: 0.5
    };

    var rect = new Rectangle( rectOptions );
    this.addChild( rect );

    // Update the size of the massNode
    mass.radiusProperty.link( function( radiusValue ) {
      rect.rectBounds = new Bounds2(
        modelViewTransform2.modelToViewDeltaX( -radiusValue ),
        hookHeight,
        modelViewTransform2.modelToViewDeltaX( radiusValue ),
        modelViewTransform2.modelToViewDeltaY( -mass.cylinderHeightProperty.get() ) + hookHeight );

      rect.fill = new LinearGradient( -rect.width / 2, 0, rect.width / 2, 0 ).addColorStop( 0.3, mass.color )
        .addColorStop( 0.8, Color.toColor( mass.color ).colorUtilsBrighter( 0.9 ) )
        .addColorStop( 1, Color.toColor( mass.color ).colorUtilsBrighter( 0.4 ) );
    } );

    var hookShape = new Shape();
    var radius = hookHeight / 4;
    hookShape.arc( 0, 0, radius, Math.PI, (1 / 2 * Math.PI) );
    hookShape.lineTo( 0, hookHeight / 2 );
    var hookNode = new Path( hookShape, {
      stroke: 'black',
      lineWidth: 1.5,
      lineCap: 'round',
      centerX: rect.centerX,
      bottom: rect.top
    } );
    this.addChild( hookNode );

    var labelString;
    var createLabel = function( labelString ) {
      var label = new Text( labelString, {
        font: MassesAndSpringsConstants.TITLE_FONT,
        fill: 'black',
        centerY: rect.centerY,
        centerX: 0,
        pickable: false,
        maxWidth: 50,
        tandem: tandem.createTandem( 'label' )
      } );

      if ( mass.options.isLabeled ) {
        self.addChild( label );
      }
      mass.massProperty.link( function() {
        label.center = rect.center;
      } );

      // Adjust the mass label for adjustable masses.
      if ( mass.options.adjustable ) {
        self.mass.massProperty.link( function( massValue ) {
          if ( model.masses[ 0 ] ) {
            label.setText( StringUtils.fillIn( massValueString, { mass: Util.roundSymmetric( massValue * 1000 ) } ) );
          }
          if ( model.masses[ 0 ] && model.masses[ 0 ].springProperty.get() ) {
            model.masses[ 0 ].springProperty.get().animatingProperty.set( true );
          }
        } );
      }
    };
    labelString = mass.options.mysteryLabel ? questionMarkString : StringUtils.fillIn( massValueString, { mass: mass.mass * 1000 } );
    createLabel( labelString );

    this.mass.positionProperty.link( function( position ) {
      self.translation = modelViewTransform2.modelToViewPosition( position );
    } );

    this.movableDragHandler = new MovableDragHandler( this.mass.positionProperty, {

      // Allow moving a finger (touch) across a node to pick it up.
      dragBounds: modelViewTransform2.viewToModelBounds( dragBounds.get() ),
      allowTouchSnag: true,
      modelViewTransform: modelViewTransform2,
      tandem: tandem.createTandem( 'dragHandler' ),

      // Handler that moves the particle in model space.
      onDrag: function() {

        // Checks if mass should be attached/detached to spring and adjusts its position if so.
        model.adjustDraggedMassPosition( self.mass );
      },

      startDrag: function() {
        mass.userControlledProperty.set( true );
        self.moveToFront();
      },

      endDrag: function() {
        mass.userControlledProperty.set( false );
      }
    } );

    dragBounds.link( function( dragBounds ) {
      self.movableDragHandler.dragBounds.set( dragBounds );
    } );

    this.addInputListener( this.movableDragHandler );

    var forceNullLine = new Line( 0, 0, 0, 0, {
      stroke: 'black',
      lineWidth: 1,
      cursor: 'pointer'
    } );

    //Arrows created for vectors associated with mass nodes
    this.velocityArrow = new VectorArrow( MassesAndSpringsConstants.VELOCITY_ARROW_COLOR, 'velocityArrow', tandem );
    this.accelerationArrow = new VectorArrow( MassesAndSpringsConstants.ACCELERATION_ARROW_COLOR, 'accelerationArrow', tandem );
    this.gravityForceArrow = new ForceVectorArrow( MassesAndSpringsConstants.GRAVITY_ARROW_COLOR, 'gravityForceArrow', tandem );
    this.springForceArrow = new ForceVectorArrow( MassesAndSpringsConstants.SPRING_ARROW_COLOR, 'springForceArrow', tandem );
    this.netForceArrow = new ForceVectorArrow( 'black', 'netForceArrow', tandem );

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
            arrowNode.visible = !!spring && springVectorVisibility && forcesMode === MassesAndSpringsConstants.FORCES_STRING;
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
          self.netForceArrow.visible = !!spring && forcesMode === MassesAndSpringsConstants.NET_FORCE_STRING;
        }
      );

      // Show/hide line at base of vectors
      Property.multilink( [ mass.springProperty, model.gravityVectorVisibilityProperty, model.springVectorVisibilityProperty, model.forcesModeProperty ],
        function( spring, gravityForceVisible, springForceVisible, forcesVisible ) {
          forceNullLine.visible = !!spring && (gravityForceVisible || springForceVisible || forcesVisible === MassesAndSpringsConstants.NET_FORCE_STRING);
        } );

      //TODO: Create MASArrowNode with arguments for deltas in X&Y, mass position, and the property it is depicting
      //Links for handling the length of the vectors in response to the system.
      var scalingFactor = 3;
      Property.multilink( [ mass.verticalVelocityProperty, model.velocityVectorVisibilityProperty ], function( velocity, visible ) {
        if ( visible ) {
          var position = mass.positionProperty.get();
          self.velocityArrow.setTailAndTip(
            position.x - 10,
            position.y + rect.top + 10,
            position.x - 10,
            position.y + rect.top + 10 - ARROW_SIZE_DEFAULT * velocity * scalingFactor
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
        model.accelerationVectorVisibilityProperty,
        mass.accelerationProperty
      ], function( netForce, forcesMode, accelerationVisible, netAcceleration ) {
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
          if ( Math.abs( netAcceleration ) > 1E-6 ) {
            self.accelerationArrow.setTailAndTip(
              position.x + 10,
              position.y + rect.top + 10,
              position.x + 10,
              position.y + rect.top + 10 - ARROW_SIZE_DEFAULT * netAcceleration / scalingFactor
            );
          }
          else if ( netAcceleration === 0 ) {
            self.accelerationArrow.visible = false;
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
